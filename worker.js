// IPTV Brasil Pro — serve arquivos estáticos gerados pelo GitHub Actions (quase zero CPU, ideal p/ plano free)
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (obj, extra = {}) => new Response(JSON.stringify(obj), { headers: { ...CORS, ...extra } });

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { path = url.pathname; }

    if (path === '/') {
      return new Response(`IPTV Brasil Pro\n\nInstale no Stremio: stremio://${url.host}/manifest.json\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    let m;
    if ((m = path.match(/^\/(meta|stream)\/tv\/(iptv_[0-9a-f]{20})\.json$/))) {
      const id = m[2];
      const res = await env.ASSETS.fetch(new URL(`/d/${id.slice(5, 7)}.json`, url));
      if (!res.ok) return json(m[1] === 'meta' ? { meta: null } : { streams: [] });
      const ch = (await res.json())[id];
      if (!ch) return json(m[1] === 'meta' ? { meta: null } : { streams: [] });
      const [name, logo, group, streams] = ch;
      const img = logo || 'https://img.icons8.com/color/480/tv.png';
      if (m[1] === 'meta') {
        return json({ meta: { id, type: 'tv', name, poster: img, background: img,
          description: `📺 ${group}\n🇧🇷 Canal ao vivo 24h\n🔁 ${streams.length} opção(ões) de transmissão — se travar, escolha outra`, genres: ['IPTV'], releaseInfo: 'Ao Vivo' } });
      }
      const host = u => { try { return new URL(u).hostname; } catch { return ''; } };
      return json({ streams: streams.map(([label, u], i) => ({
        name: `📺 ${label}`,
        title: `${name}\nOpção ${i + 1}/${streams.length} • ${host(u)}`,
        url: u,
        behaviorHints: { notWebReady: true, bingeGroup: `iptv-${group.toLowerCase().replace(/\s+/g, '-')}` },
      })) });
    }

    if (path === '/manifest.json' || path.startsWith('/catalog/tv/')) {
      const res = await env.ASSETS.fetch(new URL(path, url));
      if (!res.ok) return json({ metas: [] });
      return new Response(res.body, { headers: { ...CORS, 'Cache-Control': 'public, max-age=300' } });
    }
    return json({ error: 'not found' });
  },
};
                                                

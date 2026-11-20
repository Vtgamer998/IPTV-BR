// IPTV Brasil Pro — Stremio addon rodando em Cloudflare Workers (plano free)
// Port do addon Node original (index.js). EPG foi removido (era opcional).

const M3U_SOURCES = [
  { url: 'http://abre.ai/manotv3' },
  { url: 'https://iptv-org.github.io/iptv/countries/br.m3u' },
  { url: 'https://iptv-org.github.io/iptv/index.m3u', onlyBR: true }, // lista enorme: se estourar CPU no free, remova
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/Canais.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR01.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR02.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR03.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR04.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisIPTV.m3u8' },
];
const SLICES = 3; // fontes por execução do cron = M3U_SOURCES.length / SLICES
const PAGE_SIZE = 300;
const MEM_TTL = 5 * 60 * 1000;

const CATEGORIES = [
  { id: 'cat_globo', name: 'Canais Globo', keywords: ['globo','globonews','gnt','futura','viva','multishow','bis','woohoo','rpc','rbs','nsc','tv clube','inter tv','tv tem','rede amazonica','tv liberal'] },
  { id: 'cat_record', name: 'Canais Record', keywords: ['record','recordtv','recordnews','record news','tv record','rede record','sictv','tv tropical'] },
  { id: 'cat_sbt', name: 'Canais SBT', keywords: ['sbt','tv aratu','tv difusora','sistema brasileiro','sbt guajará','sbt cidade verde'] },
  { id: 'cat_band', name: 'Canais Band', keywords: ['band','bandnews','bandsports','bandeirantes','rede bandeirantes','band sports','new brasil','band arapuan'] },
  { id: 'cat_redetv', name: 'RedeTV! & CNT', keywords: ['redetv','rede tv','cnt','tv gazeta','tv cultura','gazeta','cultura'] },
  { id: 'cat_sportv', name: 'SporTV', keywords: ['sportv','spor tv','sport tv'] },
  { id: 'cat_espn', name: 'ESPN & Fox Sports', keywords: ['espn','fox sports'] },
  { id: 'cat_esportes', name: 'Esportes', keywords: ['esportes','premiere','futebol','nsports','cazé','combate','dazn','f1 tv','bandsports','tnt sports','libertadores','brasileirão','copa do brasil','conmebol','xsports','trace sport'] },
  { id: 'cat_filmes', name: 'Filmes e Séries', keywords: ['filmes','telecine','space','tnt','hbo','amc','sony','warner','fx','universal','megapix','cinemax','paramount','runtime','movies','max','darkflix','bora filmes','cine brasil','tela brasil','filmelier','dorama','série','series'] },
  { id: 'cat_noticias', name: 'Notícias', keywords: ['notícias','noticias','news','cnn','globonews','bandnews','recordnews','jovem pan','jp news','bm&c','euronews','france 24','dw','bbc','al jazeera','bloomberg','cnbc','tv câmara','tv senado','tv justiça','canal gov','tvd news','tv brasil'] },
  { id: 'cat_infantil', name: 'Infantil', keywords: ['infantil','kids','cartoon','nickelodeon','nick jr','disney','gloob','boomerang','discovery kids','cartoon network','cartoonito','babyfirst','zoomoo','tooncast','tv ra tim bum','pinkids','super zoe','universo kids'] },
  { id: 'cat_animes', name: 'Animes & Geek', keywords: ['anime','animes','crunchyroll','funimation','dragon ball','naruto','one piece','pokemon','loading tv','otaku','geek','dorama','k-drama','kdrama'] },
  { id: 'cat_musica', name: 'Música', keywords: ['música','musica','music','mtv','vh1','multishow','bis','woohoo','vevo','trace urban','trace gospel','kiss tv','pisadinha','sertanejo','gospel music','k-pop','antena 1','maisum'] },
  { id: 'cat_variedades', name: 'Variedades & Discovery', keywords: ['variedades','discovery','animal planet','national geographic','nat geo','history','comedy central','canal brasil','tlc','a&e','lifetime','arte 1','gnt','prime box','modo viagem','hallo doc','revry','rakuten'] },
  { id: 'cat_novelas', name: 'Novelas', keywords: ['novelas','novela','telenovela','canal viva','viva','tlnovelas','pasiones','sic novelas','tvi ficção','rtp','globoplay novelas','sbt novelas','record novelas','megapix','escrava isaura'] },
  { id: 'cat_documentarios', name: 'Documentários', keywords: ['documentário','documentarios','documentary','docubox','hallo doc','crime investigation','curta','viasat','rakuten documentários','investigação','investigation discovery'] },
  { id: 'cat_reality', name: 'Reality Shows', keywords: ['reality','masterchef','shark tank','bbb','big brother','a fazenda','the voice','no limite','power couple','de férias com o ex','drag race','queer eye','estrela da casa'] },
  { id: 'cat_comedia', name: 'Comédia', keywords: ['comédia','comedia','comedy','failarmy','humor','pegadinhas','south park','simpsons','futurama','family guy','porta dos fundos','trapalhões'] },
  { id: 'cat_lutas', name: 'Lutas & MMA', keywords: ['lutas','fight','ufc','combate','pfl','bellator','mma','boxe','wwe','sft combat','one championship','lucha libre','muay thai'] },
  { id: 'cat_internacional', name: 'Internacional', keywords: ['internacional','sic','rtp','tvi','france 24','euronews','dw brasil','bbc','fox news','sky','eleven sports','canal 11','rai','zdf','rtl','tve','telefe','telemundo','cnn international','nhk','cgtn','al jazeera','deportes'] },
  { id: 'cat_pluto', name: 'Pluto TV', keywords: ['pluto'] },
  { id: 'cat_aberto', name: 'Canais Abertos', keywords: ['aberto','tv cultura','tv brasil','rede vida','tv aparecida','canção nova','rede família','tv escola','tv senado','tv câmara','tv justiça','canal gov','canal rural','canal do boi','agro','novo tempo','rede minas','rede meio norte','tve','redetv','tv gazeta','imperial tv','bs tv','rede brasil'] },
  { id: 'cat_religioso', name: 'Religioso & Gospel', keywords: ['gospel','religioso','cristão','evangelical','igreja','canção nova','rede vida','aparecida','evangelizar','rede qdm','ministério infantil','novo tempo','cnb','rede família','tv imaculada','tv vianney','gln tv','tenda tv','vida cristã'] },
  { id: 'cat_premium', name: 'Premium & PPV', keywords: ['premium','pay per view','ppv','telecine premium','telecine action','telecine pipoca','telecine fun','telecine touch','telecine cult','premiere 1','premiere 2','premiere 3','premiere 4','premiere 5','premiere 6','premiere 7','premiere 8','premiere fc','premiere clubes','combate hd','combate fhd','combate 4k'] },
  { id: 'cat_4k', name: 'Canais 4K & UHD', keywords: ['4k','uhd','ultra hd','4k hdr','4k dolby'] },
];

const manifest = {
  id: 'com.iptv.brasil.addon',
  version: '4.2.0',
  name: 'IPTV Brasil Pro',
  description: '🇧🇷 Addon IPTV brasileiro para Stremio e Nuvio!\n📺 Milhares de canais em 25 categorias',
  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],
  catalogs: CATEGORIES.map(c => ({
    type: 'tv', id: c.id, name: c.name,
    extra: [{ name: 'search', isRequired: false }, { name: 'skip', isRequired: false }, { name: 'genre', isRequired: false, options: ['IPTV'] }],
  })),
  idPrefixes: ['iptv_'],
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png',
  background: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2070&q=80',
  behaviorHints: { adult: false, p2p: false, configurable: false, configurationRequired: false },
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (obj, extra = {}) => new Response(JSON.stringify(obj), { headers: { ...CORS, ...extra } });

// ---------------- Parser M3U ----------------
const VALID_PROTOCOLS = ['http://', 'https://', 'rtmp://', 'rtmps://', 'rtsp://', 'udp://', 'rtp://'];
const INVALID_EXTS = ['.jpg','.jpeg','.png','.gif','.webp','.svg','.ico','.bmp','.txt','.html','.htm','.xml','.json','.zip','.rar','.mp4','.avi','.mkv','.mov'];

function isBrazilian(extinf, tvgId) {
  if (tvgId && /\.br(@|$)/i.test(tvgId)) return true;
  const country = ((extinf.match(/tvg-country="([^"]*)"/i) || [])[1] || '').toUpperCase();
  return country.split(/[;,]/).map(x => x.trim()).includes('BR');
}

async function sha1(str) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 20);
}

// retorna itens compactos: [id, name, logo, group, url]
async function parseM3U(text, { onlyBR } = {}) {
  const lines = text.split('\n');
  const items = [];
  const seen = new Set();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('#EXTINF:')) continue;
    const tvgId = (line.match(/tvg-id="([^"]+)"/) || [])[1] || null;
    if (onlyBR && !isBrazilian(line, tvgId)) continue;
    const logo = (line.match(/tvg-logo="([^"]+)"/) || [])[1] || '';
    const group = (line.match(/group-title="([^"]+)"/) || [])[1] || 'Outros';
    const name = line.substring(line.indexOf(',') + 1).trim().replace(/[🔴🟢⚫🟡]/g, '').trim();
    const url = (lines[i + 1] || '').trim();
    if (!url || !name || seen.has(url)) continue;
    const low = url.toLowerCase();
    if (!VALID_PROTOCOLS.some(p => low.startsWith(p))) continue;
    if (INVALID_EXTS.some(e => low.endsWith(e))) continue;
    seen.add(url);
    items.push([await sha1(url), name, logo, group, url]);
    i++;
  }
  return items;
}

// ---------------- Atualização (cron) ----------------
async function refreshSlice(env, slice) {
  const jobs = [];
  M3U_SOURCES.forEach((src, i) => { if (i % SLICES === slice) jobs.push([i, src]); });
  await Promise.all(jobs.map(async ([i, src]) => {
    try {
      const res = await fetch(src.url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IPTV-Brasil/4.2)' }, redirect: 'follow' });
      const text = await res.text();
      if (!text.includes('#EXTINF')) return;
      const items = await parseM3U(text, src);
      if (items.length) await env.IPTV_KV.put('src:' + i, JSON.stringify(items));
    } catch (e) { console.error('fonte falhou', src.url, e.message); }
  }));
}

// ---------------- Leitura ----------------
let mem = null, memTime = 0;
async function loadChannels(env) {
  if (mem && Date.now() - memTime < MEM_TTL) return mem;
  const parts = await Promise.all(M3U_SOURCES.map((_, i) => env.IPTV_KV.get('src:' + i, 'json')));
  const seen = new Set(), out = [];
  for (const items of parts) for (const it of items || []) {
    if (seen.has(it[4])) continue;
    seen.add(it[4]); out.push(it);
  }
  if (out.length) { mem = out; memTime = Date.now(); }
  return out;
}

function parseExtra(s) {
  const o = {};
  if (!s) return o;
  for (const p of decodeURIComponent(s).split('&')) { const [k, ...v] = p.split('='); o[k] = v.join('='); }
  return o;
}

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

  if (path === '/manifest.json') return json(manifest, { 'Cache-Control': 'public, max-age=3600' });

  if (path === '/refresh') { // opcional: /refresh?all=1 para popular o KV logo após o deploy
    for (let s = 0; s < SLICES; s++) await refreshSlice(env, s);
    return json({ ok: true });
  }

  let m;
  if ((m = path.match(/^\/catalog\/tv\/([^/]+?)(?:\/([^/]+))?\.json$/))) {
    const cat = CATEGORIES.find(c => c.id === m[1]);
    if (!cat) return json({ metas: [] });
    const extra = parseExtra(m[2]);
    const q = extra.search ? extra.search.toLowerCase() : null;
    const skip = Math.max(0, parseInt(extra.skip, 10) || 0);
    const kws = cat.keywords.map(k => k.toLowerCase());
    const items = await loadChannels(env);
    const metas = items
      .filter(([, name, , group]) => {
        const n = name.toLowerCase(), g = group.toLowerCase();
        if (!kws.some(k => g.includes(k) || n.includes(k))) return false;
        return q ? n.includes(q) || g.includes(q) : true;
      })
      .slice(skip, skip + PAGE_SIZE)
      .map(([id, name, logo, group]) => ({
        id, type: 'tv', name,
        poster: logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${group}`, genres: ['IPTV'], releaseInfo: 'Ao Vivo',
      }));
    return json({ metas }, metas.length ? { 'Cache-Control': 'public, max-age=300' } : {});
  }

  if ((m = path.match(/^\/(meta|stream)\/tv\/([^/]+)\.json$/))) {
    const id = decodeURIComponent(m[2]);
    const ch = (await loadChannels(env)).find(x => x[0] === id);
    if (!ch) return json(m[1] === 'meta' ? { meta: null } : { streams: [] });
    const [, name, logo, group, streamUrl] = ch;
    if (m[1] === 'meta') {
      return json({ meta: {
        id, type: 'tv', name,
        poster: logo || 'https://img.icons8.com/color/480/tv.png',
        background: logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${group}\n🇧🇷 Canal ao vivo 24h`, genres: ['IPTV'], releaseInfo: 'Ao Vivo',
      } });
    }
    return json({ streams: [{
      name: '📺 IPTV Brasil Pro',
      title: `${name}\n${group} • Ao Vivo`,
      url: streamUrl,
      behaviorHints: { notWebReady: true, bingeGroup: `iptv-${group.toLowerCase().replace(/\s+/g, '-')}` },
    }] });
  }

  if (path === '/') {
    return new Response(`IPTV Brasil Pro\n\nInstale no Stremio: stremio://${url.host}/manifest.json\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  return json({ error: 'not found' }, {});
}

export default {
  async fetch(request, env, ctx) {
    try { return await handle(request, env); }
    catch (e) { return json({ error: e.message }); }
  },
  async scheduled(event, env, ctx) {
    const slice = Math.floor(event.scheduledTime / 600000) % SLICES;
    ctx.waitUntil(refreshSlice(env, slice));
  },
};

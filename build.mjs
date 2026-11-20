// Gera os arquivos estáticos do addon (rodado pelo GitHub Actions). Node 18+.
import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const M3U_SOURCES = [
  { url: 'http://abre.ai/manotv3' },
  { url: 'https://iptv-org.github.io/iptv/countries/br.m3u' },
  { url: 'https://iptv-org.github.io/iptv/index.m3u', onlyBR: true },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/Canais.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR01.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR02.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR03.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisBR04.m3u8' },
  { url: 'https://raw.githubusercontent.com/Ramys/Iptv-Brasil-2026/master/CanaisIPTV.m3u8' },
];
const PAGE_SIZE = 300;
const OUT = 'public';

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
  version: '5.0.0',
  name: 'IPTV Brasil Pro',
  description: '🇧🇷 Addon IPTV brasileiro para Stremio e Nuvio!\n📺 Milhares de canais em 25 categorias',
  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],
  catalogs: CATEGORIES.map(c => ({ type: 'tv', id: c.id, name: c.name, extra: [{ name: 'skip', isRequired: false }] })),
  idPrefixes: ['iptv_'],
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png',
  background: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2070&q=80',
  behaviorHints: { adult: false, p2p: false, configurable: false, configurationRequired: false },
};

const VALID = ['http://', 'https://', 'rtmp://', 'rtmps://', 'rtsp://', 'udp://', 'rtp://'];
const BAD_EXT = ['.jpg','.jpeg','.png','.gif','.webp','.svg','.ico','.bmp','.txt','.html','.htm','.xml','.json','.zip','.rar','.mp4','.avi','.mkv','.mov'];

function isBrazilian(extinf, tvgId) {
  if (tvgId && /\.br(@|$)/i.test(tvgId)) return true;
  const country = ((extinf.match(/tvg-country="([^"]*)"/i) || [])[1] || '').toUpperCase();
  return country.split(/[;,]/).map(x => x.trim()).includes('BR');
}

function parseM3U(text, { onlyBR } = {}) {
  const lines = text.split('\n');
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('#EXTINF:')) continue;
    const tvgId = (line.match(/tvg-id="([^"]+)"/) || [])[1] || null;
    if (onlyBR && !isBrazilian(line, tvgId)) continue;
    const logo = (line.match(/tvg-logo="([^"]+)"/) || [])[1] || '';
    const group = (line.match(/group-title="([^"]+)"/) || [])[1] || 'Outros';
    const name = line.substring(line.indexOf(',') + 1).trim().replace(/[🔴🟢⚫🟡]/g, '').trim();
    const url = (lines[i + 1] || '').trim();
    if (!url || !name) continue;
    const low = url.toLowerCase();
    if (!VALID.some(p => low.startsWith(p))) continue;
    if (BAD_EXT.some(e => low.endsWith(e))) continue;
    items.push({ name, logo, group, url });
    i++;
  }
  return items;
}

async function load(src) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 30000);
    const res = await fetch(src.url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IPTV-Brasil/5.0)' }, redirect: 'follow', signal: ctl.signal });
    clearTimeout(t);
    const text = await res.text();
    if (!text.includes('#EXTINF')) { console.warn('M3U inválido:', src.url); return []; }
    const items = parseM3U(text, src);
    console.log(`OK ${items.length} canais — ${src.url}`);
    return items;
  } catch (e) { console.warn('Falhou:', src.url, e.message); return []; }
}

const results = await Promise.all(M3U_SOURCES.map(load));
const seen = new Set();
const channels = [];
for (const list of results) for (const it of list) {
  if (seen.has(it.url)) continue;
  seen.add(it.url);
  channels.push({ id: 'iptv_' + createHash('sha1').update(it.url).digest('hex').slice(0, 20), ...it });
}
console.log('Total:', channels.length);
if (channels.length < 50) { console.error('Poucos canais — abortando para não apagar os dados atuais.'); process.exit(1); }

rmSync(OUT, { recursive: true, force: true });
const write = (p, obj) => { const f = `${OUT}/${p}`; mkdirSync(f.slice(0, f.lastIndexOf('/')), { recursive: true }); writeFileSync(f, JSON.stringify(obj)); };

write('manifest.json', manifest);

for (const cat of CATEGORIES) {
  const kws = cat.keywords.map(k => k.toLowerCase());
  const metas = channels.filter(ch => {
    const n = ch.name.toLowerCase(), g = ch.group.toLowerCase();
    return kws.some(k => g.includes(k) || n.includes(k));
  }).map(ch => ({
    id: ch.id, type: 'tv', name: ch.name,
    poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
    description: `📺 ${ch.group}`, genres: ['IPTV'], releaseInfo: 'Ao Vivo',
  }));
  for (let skip = 0; skip === 0 || skip < metas.length; skip += PAGE_SIZE) {
    const page = { metas: metas.slice(skip, skip + PAGE_SIZE) };
    write(skip === 0 ? `catalog/tv/${cat.id}.json` : `catalog/tv/${cat.id}/skip=${skip}.json`, page);
    if (skip === 0) write(`catalog/tv/${cat.id}/skip=0.json`, page);
  }
  console.log(`${cat.name}: ${metas.length}`);
}

// shards para meta/stream: d/<2 primeiros hex do id>.json
const shards = {};
for (const ch of channels) (shards[ch.id.slice(5, 7)] ||= {})[ch.id] = [ch.name, ch.logo, ch.group, ch.url];
for (const [k, v] of Object.entries(shards)) write(`d/${k}.json`, v);
console.log('Shards:', Object.keys(shards).length);

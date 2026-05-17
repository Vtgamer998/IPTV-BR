const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

// ============================================================
//  LISTA DE M3Us — ordene do mais confiável pro menos
//  Se a primeira falhar, tenta a próxima automaticamente
// ============================================================
const M3U_SOURCES = [
  'http://abre.ai/manotv3',
  'https://iptv-org.github.io/iptv/countries/br.m3u',
  // Adicione outras fontes abaixo (substitua pelos seus links):
  // 'https://raw.githubusercontent.com/SEU_USER/SEU_REPO/main/lista.m3u',
  // 'https://outra-fonte.com/lista.m3u',
  // 'https://terceira-fonte.com/iptv.m3u',
];

const CATEGORIES = [
  { id: 'cat_globo',        name: 'Canais Globo',              keywords: ['globo','globonews','gnt','futura','viva','multishow','bis','woohoo','rpc','rbs','nsc','tv clube','inter tv','tv tem','rede amazonica','tv liberal'] },
  { id: 'cat_record',       name: 'Canais Record',             keywords: ['record','recordtv','recordnews','record news','tv record','rede record','sictv','tv tropical'] },
  { id: 'cat_sbt',          name: 'Canais SBT',                keywords: ['sbt','tv aratu','tv difusora','sistema brasileiro','sbt guajará','sbt cidade verde'] },
  { id: 'cat_band',         name: 'Canais Band',               keywords: ['band','bandnews','bandsports','bandeirantes','rede bandeirantes','band sports','new brasil','band arapuan'] },
  { id: 'cat_redetv',       name: 'RedeTV! & CNT',             keywords: ['redetv','rede tv','cnt','tv gazeta','tv cultura','gazeta','cultura'] },
  { id: 'cat_sportv',       name: 'SporTV',                    keywords: ['sportv','spor tv','sport tv'] },
  { id: 'cat_espn',         name: 'ESPN & Fox Sports',         keywords: ['espn','fox sports'] },
  { id: 'cat_esportes',     name: 'Esportes',                  keywords: ['esportes','premiere','futebol','nsports','cazé','combate','dazn','f1 tv','bandsports','tnt sports','libertadores','brasileirão','copa do brasil','conmebol','xsports','trace sport'] },
  { id: 'cat_filmes',       name: 'Filmes e Séries',           keywords: ['filmes','telecine','space','tnt','hbo','amc','sony','warner','fx','universal','megapix','cinemax','paramount','runtime','movies','max','darkflix','bora filmes','cine brasil','tela brasil','filmelier','dorama','série','series'] },
  { id: 'cat_noticias',     name: 'Notícias',                  keywords: ['notícias','noticias','news','cnn','globonews','bandnews','recordnews','jovem pan','jp news','bm&c','euronews','france 24','dw','bbc','al jazeera','bloomberg','cnbc','tv câmara','tv senado','tv justiça','canal gov','tvd news','tv brasil'] },
  { id: 'cat_infantil',     name: 'Infantil',                  keywords: ['infantil','kids','cartoon','nickelodeon','nick jr','disney','gloob','boomerang','discovery kids','cartoon network','cartoonito','babyfirst','zoomoo','tooncast','tv ra tim bum','pinkids','super zoe','universo kids'] },
  { id: 'cat_animes',       name: 'Animes & Geek',             keywords: ['anime','animes','crunchyroll','funimation','dragon ball','naruto','one piece','pokemon','loading tv','otaku','geek','dorama','k-drama','kdrama'] },
  { id: 'cat_musica',       name: 'Música',                    keywords: ['música','musica','music','mtv','vh1','multishow','bis','woohoo','vevo','trace urban','trace gospel','kiss tv','pisadinha','sertanejo','gospel music','k-pop','antena 1','maisum'] },
  { id: 'cat_variedades',   name: 'Variedades & Discovery',    keywords: ['variedades','discovery','animal planet','national geographic','nat geo','history','comedy central','canal brasil','tlc','a&e','lifetime','arte 1','gnt','prime box','modo viagem','hallo doc','revry','rakuten'] },
  { id: 'cat_novelas',      name: 'Novelas',                   keywords: ['novelas','novela','telenovela','canal viva','viva','tlnovelas','pasiones','sic novelas','tvi ficção','rtp','globoplay novelas','sbt novelas','record novelas','megapix','escrava isaura'] },
  { id: 'cat_documentarios',name: 'Documentários',             keywords: ['documentário','documentarios','documentary','docubox','hallo doc','crime investigation','curta','viasat','rakuten documentários','investigação','investigation discovery'] },
  { id: 'cat_reality',      name: 'Reality Shows',             keywords: ['reality','masterchef','shark tank','bbb','big brother','a fazenda','the voice','no limite','power couple','de férias com o ex','drag race','queer eye','estrela da casa'] },
  { id: 'cat_comedia',      name: 'Comédia',                   keywords: ['comédia','comedia','comedy','failarmy','humor','pegadinhas','south park','simpsons','futurama','family guy','porta dos fundos','trapalhões'] },
  { id: 'cat_lutas',        name: 'Lutas & MMA',               keywords: ['lutas','fight','ufc','combate','pfl','bellator','mma','boxe','wwe','sft combat','one championship','lucha libre','muay thai'] },
  { id: 'cat_internacional', name: 'Internacional',            keywords: ['internacional','sic','rtp','tvi','france 24','euronews','dw brasil','bbc','fox news','sky','eleven sports','canal 11','rai','zdf','rtl','tve','telefe','telemundo','cnn international','nhk','cgtn','al jazeera','deportes'] },
  { id: 'cat_pluto',        name: 'Pluto TV',                  keywords: ['pluto'] },
  { id: 'cat_aberto',       name: 'Canais Abertos',            keywords: ['aberto','tv cultura','tv brasil','rede vida','tv aparecida','canção nova','rede família','tv escola','tv senado','tv câmara','tv justiça','canal gov','canal rural','canal do boi','agro','novo tempo','rede minas','rede meio norte','tve','redetv','tv gazeta','imperial tv','bs tv','rede brasil'] },
  { id: 'cat_religioso',    name: 'Religioso & Gospel',        keywords: ['gospel','religioso','cristão','evangelical','igreja','canção nova','rede vida','aparecida','evangelizar','rede qdm','ministério infantil','novo tempo','cnb','rede família','tv imaculada','tv vianney','gln tv','tenda tv','vida cristã'] },
  { id: 'cat_premium',      name: 'Premium & PPV',             keywords: ['premium','pay per view','ppv','telecine premium','telecine action','telecine pipoca','telecine fun','telecine touch','telecine cult','premiere 1','premiere 2','premiere 3','premiere 4','premiere 5','premiere 6','premiere 7','premiere 8','premiere fc','premiere clubes','combate hd','combate fhd','combate 4k'] },
  { id: 'cat_4k',           name: 'Canais 4K & UHD',           keywords: ['4k','uhd','ultra hd','4k hdr','4k dolby'] },
];

const manifest = {
  id: 'com.iptv.brasil.addon',
  version: '4.1.0',
  name: 'IPTV Brasil Pro',
  description: '🇧🇷 Addon IPTV brasileiro para Stremio e Nuvio!\n📺 Mais de 2000 canais em 25 categorias\n💰 Apoie: https://livepix.gg/willacris',
  contactEmail: 'willacris023@proton.me',
  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],
  catalogs: CATEGORIES.map(cat => ({
    type: 'tv',
    id: cat.id,
    name: cat.name,
    extra: [
      { name: 'search', isRequired: false },
      { name: 'genre', isRequired: false, options: ['IPTV'] }
    ]
  })),
  idPrefixes: ['iptv_'],
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png',
  background: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2070&q=80',
  behaviorHints: { adult: false, p2p: false, configurable: false, configurationRequired: false }
};

// ============================================================
//  CACHE
// ============================================================
let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// ============================================================
//  PARSER M3U
// ============================================================
function parseM3U(rawText) {
  const lines = rawText.split('\n');
  const items = [];
  const seenUrls = new Set();
  const logoRegex = /tvg-logo="([^"]+)"/;
  const groupRegex = /group-title="([^"]+)"/;

  const VALID_PROTOCOLS = ['http://', 'https://', 'rtmp://', 'rtmps://', 'rtsp://', 'udp://', 'rtp://'];
  const INVALID_EXTS = ['.jpg','.jpeg','.png','.gif','.webp','.svg','.ico','.bmp','.txt','.html','.htm','.xml','.json','.zip','.rar','.mp4','.avi','.mkv','.mov'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('#EXTINF:')) continue;

    const logoMatch = line.match(logoRegex);
    const groupMatch = line.match(groupRegex);
    const logo = logoMatch ? logoMatch[1] : 'https://img.icons8.com/color/480/tv.png';
    const group = groupMatch ? groupMatch[1] : 'Outros';
    const name = line.substring(line.indexOf(',') + 1).trim()
      .replace(/[🔴🟢⚫🟡]/g, '').trim();
    const url = (lines[i + 1] || '').trim();

    if (!url || !name || seenUrls.has(url)) continue;
    if (!VALID_PROTOCOLS.some(p => url.toLowerCase().startsWith(p))) continue;
    if (INVALID_EXTS.some(ext => url.toLowerCase().endsWith(ext))) continue;

    seenUrls.add(url);
    items.push({
      id: 'iptv_' + Buffer.from(url).toString('base64').slice(0, 32),
      name,
      logo,
      group,
      url
    });
    i++; // pula a linha da URL
  }

  return items;
}

// ============================================================
//  CARREGA M3U COM FALLBACK
// ============================================================
async function loadM3U() {
  const now = Date.now();

  if (cache && cache.length > 0 && (now - cacheTime < CACHE_DURATION)) {
    console.log(`📋 Cache ativo: ${cache.length} canais`);
    return cache;
  }

  const axiosConfig = {
    timeout: 30000,
    maxRedirects: 10,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IPTV-Brasil/4.1)',
      'Accept': '*/*'
    },
    responseType: 'text'
  };

  for (let i = 0; i < M3U_SOURCES.length; i++) {
    const url = M3U_SOURCES[i];
    try {
      console.log(`🔄 Tentando fonte ${i + 1}/${M3U_SOURCES.length}: ${url}`);
      const res = await axios.get(url, axiosConfig);
      const rawText = typeof res.data === 'string' ? res.data : String(res.data);

      if (!rawText.includes('#EXTM3U') && !rawText.includes('#EXTINF')) {
        console.warn(`⚠️  Fonte ${i + 1} não retornou M3U válido (${rawText.length} bytes). Tentando próxima...`);
        continue;
      }

      const items = parseM3U(rawText);
      if (items.length === 0) {
        console.warn(`⚠️  Fonte ${i + 1} retornou 0 canais. Tentando próxima...`);
        continue;
      }

      cache = items;
      cacheTime = now;
      console.log(`✅ Fonte ${i + 1} OK: ${items.length} canais carregados!`);
      return items;

    } catch (err) {
      console.error(`❌ Fonte ${i + 1} falhou: ${err.message}`);
    }
  }

  // Todas as fontes falharam — usa cache antigo se disponível
  if (cache && cache.length > 0) {
    console.warn(`⚠️  Todas as fontes falharam. Usando cache expirado (${cache.length} canais).`);
    return cache;
  }

  console.error('❌ Sem canais disponíveis. Retornando lista vazia.');
  return [];
}

// ============================================================
//  HANDLERS
// ============================================================
const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ id, extra }) => {
  try {
    const items = await loadM3U();
    const category = CATEGORIES.find(c => c.id === id);
    if (!category) return { metas: [] };

    const searchQuery = extra?.search?.toLowerCase() || null;

    const metas = items
      .filter(ch => {
        const groupLower = ch.group.toLowerCase();
        const nameLower  = ch.name.toLowerCase();

        const matchesCat = category.keywords.some(kw =>
          groupLower.includes(kw.toLowerCase()) || nameLower.includes(kw.toLowerCase())
        );
        if (!matchesCat) return false;

        if (searchQuery) {
          return nameLower.includes(searchQuery) || groupLower.includes(searchQuery);
        }
        return true;
      })
      .map(ch => ({
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo'
      }));

    console.log(`📺 "${category.name}": ${metas.length} canais`);
    return { metas };

  } catch (err) {
    console.error('❌ catalogHandler:', err.message);
    return { metas: [] };
  }
});

builder.defineMetaHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);
    if (!ch) throw new Error(`Canal não encontrado: ${id}`);

    return {
      meta: {
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        background: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}\n🇧🇷 Canal ao vivo 24h\n🔥 IPTV Brasil Pro v4.1.0`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo'
      }
    };
  } catch (err) {
    console.error('❌ metaHandler:', err.message);
    throw err;
  }
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);
    if (!ch) throw new Error(`Stream não encontrado: ${id}`);

    console.log(`🎬 Stream: ${ch.name} (${ch.group})`);
    return {
      streams: [{
        name: '📺 IPTV Brasil Pro',
        title: `${ch.name}\n${ch.group} • Ao Vivo`,
        url: ch.url,
        behaviorHints: {
          notWebReady: true,
          bingeGroup: `iptv-${ch.group.toLowerCase().replace(/\s+/g, '-')}`
        }
      }]
    };
  } catch (err) {
    console.error('❌ streamHandler:', err.message);
    throw err;
  }
});

// ============================================================
//  START
// ============================================================
const port = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port })
  .then(() => {
    console.log('🚀 ============================================');
    console.log('🇧🇷  IPTV Brasil Pro v4.1.0');
    console.log(`📡 Porta: ${port}`);
    console.log(`📂 Categorias: ${CATEGORIES.length}`);
    console.log(`🔗 Fontes M3U: ${M3U_SOURCES.length}`);
    console.log('🚀 ============================================');

    // Pré-carrega o cache ao iniciar
    loadM3U().catch(err => console.error('⚠️  Erro no pré-carregamento:', err.message));
  })
  .catch(err => {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  });

process.on('uncaughtException', err  => console.error('❌ uncaughtException:', err));
process.on('unhandledRejection', err => console.error('❌ unhandledRejection:', err));

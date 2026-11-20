
// ============================================================
//  EPG (XMLTV) — guia de programação "Agora / A seguir"
//  Fontes: EPG_URLS (separadas por vírgula) ou EPG_FILE (arquivo local)
// ============================================================
const fs = require('fs');

const WINDOW_BACK_MS  = 2 * 60 * 60 * 1000;   // guarda o que terminou há até 2h
const WINDOW_AHEAD_MS = 36 * 60 * 60 * 1000;  // guarda as próximas 36h
const EPG_CACHE_MS    = 6 * 60 * 60 * 1000;   // recarrega a cada 6h

let store = { channels: new Map(), byName: new Map(), progs: new Map(), loadedAt: 0, loading: null };

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'" };
const unesc = s => (s || '').replace(/&(amp|lt|gt|quot|apos|#39);/g, m => ENT[m]).trim();

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\[[^\]]*\]|\([^)]*\)/g, ' ')
    .replace(/\b(hd|fhd|uhd|sd|4k|h265|hevc|brasil|brazil|br)\b/g, ' ')
    .replace(/[^a-z0-9+]/g, '');
}

function toMs(d, tz) {
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(d);
  if (!m) return NaN;
  const t = tz && /^[+-]\d{4}$/.test(tz) ? tz : '-0300';
  const sign = t[0] === '-' ? -1 : 1;
  const off = sign * (parseInt(t.slice(1, 3), 10) * 60 + parseInt(t.slice(3, 5), 10));
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) - off * 60000;
}

const pick = (body, tag) => {
  const m = new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + tag + '>').exec(body);
  return m ? unesc(m[1]) : '';
};

function parseChannelEl(el, out) {
  const m = /^<channel id="([^"]+)">([\s\S]*?)<\/channel>$/.exec(el);
  if (!m) return;
  const id = unesc(m[1]);
  const names = [...m[2].matchAll(/<display-name[^>]*>([\s\S]*?)<\/display-name>/g)].map(x => unesc(x[1]));
  const icon = (/<icon src="([^"]+)"/.exec(m[2]) || [])[1];
  out.channels.set(id, { id, names, icon: icon ? unesc(icon) : null });
  [id.replace(/\.[a-z]{2}$/i, ''), ...names].forEach(n => {
    const k = normalize(n);
    if (k && !out.byName.has(k)) out.byName.set(k, id);
  });
}

function parseProgEl(el, out, lo, hi) {
  const m = /^<programme start="(\d{14})(?: ([+-]\d{4}))?" stop="(\d{14})(?: ([+-]\d{4}))?" channel="([^"]+)">([\s\S]*?)<\/programme>$/.exec(el);
  if (!m) return;
  const start = toMs(m[1], m[2]), stop = toMs(m[3], m[4] || m[2]);
  if (!(stop > lo && start < hi)) return;
  const body = m[6];
  const icon = (/<icon src="([^"]+)"/.exec(body) || [])[1];
  const ch = unesc(m[5]);
  if (!out.progs.has(ch)) out.progs.set(ch, []);
  out.progs.get(ch).push({
    start, stop,
    title: pick(body, 'title'),
    sub: pick(body, 'sub-title'),
    desc: pick(body, 'desc').slice(0, 300),
    icon: icon ? unesc(icon) : null
  });
}

// Lê o XMLTV aos poucos (stream), sem nunca guardar o arquivo inteiro em memória
// e devolvendo o controle ao servidor entre os blocos (não trava as requisições).
async function parseStream(readable, now) {
  const { StringDecoder } = require('string_decoder');
  const dec = new StringDecoder('utf8');
  const out = { channels: new Map(), byName: new Map(), progs: new Map() };
  const lo = now - WINDOW_BACK_MS, hi = now + WINDOW_AHEAD_MS;
  let buf = '';

  const drain = (final) => {
    for (;;) {
      const ci = buf.indexOf('<channel id=');
      const pi = buf.indexOf('<programme ');
      let i, endTag, isCh;
      if (ci === -1 && pi === -1) { buf = final ? '' : buf.slice(-20); return; }
      if (pi === -1 || (ci !== -1 && ci < pi)) { i = ci; endTag = '</channel>'; isCh = true; }
      else { i = pi; endTag = '</programme>'; isCh = false; }
      const e = buf.indexOf(endTag, i);
      if (e === -1) { buf = buf.slice(i); return; } // elemento incompleto: espera o próximo bloco
      const el = buf.slice(i, e + endTag.length);
      buf = buf.slice(e + endTag.length);
      if (isCh) parseChannelEl(el, out); else parseProgEl(el, out, lo, hi);
    }
  };

  for await (const chunk of readable) {
    buf += typeof chunk === 'string' ? chunk : dec.write(chunk);
    drain(false);
    await new Promise(r => setImmediate(r)); // respira: deixa o servidor atender requisições
  }
  buf += dec.end();
  drain(true);
  for (const arr of out.progs.values()) arr.sort((a, b) => a.start - b.start);
  return out;
}

// Versão simples (texto inteiro) — usada só em testes
function parseXMLTV(xml, now) {
  const { Readable } = require('stream');
  return parseStream(Readable.from([xml]), now);
}

function merge(into, add) {
  for (const [k, v] of add.channels) if (!into.channels.has(k)) into.channels.set(k, v);
  for (const [k, v] of add.byName)   if (!into.byName.has(k))   into.byName.set(k, v);
  for (const [k, v] of add.progs)    if (!into.progs.has(k))    into.progs.set(k, v);
}

async function openSource(src, axios) {
  if (/^https?:\/\//i.test(src)) {
    const res = await axios.get(src, {
      timeout: 60000, maxRedirects: 10, responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IPTV-Brasil/4.2)' }
    });
    return res.data;
  }
  return fs.createReadStream(src, { encoding: null, highWaterMark: 256 * 1024 });
}

async function loadEPG(axios, sources) {
  const now = Date.now();
  if (store.channels.size && now - store.loadedAt < EPG_CACHE_MS) return store;
  if (store.loading) return store.loading;
  if (!sources.length) return store;

  store.loading = (async () => {
    const fresh = { channels: new Map(), byName: new Map(), progs: new Map() };
    for (const src of sources) {
      try {
        const stream = await openSource(src, axios);
        merge(fresh, await parseStream(stream, Date.now()));
        console.log(`🗓️  EPG OK: ${src} (${fresh.channels.size} canais, ${fresh.progs.size} com programação)`);
      } catch (err) {
        console.error(`❌ EPG falhou (${src}): ${err.message}`);
      }
    }
    if (fresh.channels.size) store = { ...fresh, loadedAt: Date.now(), loading: null };
    else store.loading = null;
    return store;
  })();
  return store.loading;
}

// Acha o id do EPG para um canal da M3U (tvg-id exato, senão nome normalizado exato)
function matchChannel(name, tvgId) {
  const base = tvgId ? tvgId.replace(/@.*$/, '') : null; // iptv-org: Canal.br@SD -> Canal.br
  if (base && store.channels.has(base)) return base;
  return store.byName.get(normalize(name)) || null;
}

function getNowNext(name, tvgId, now = Date.now()) {
  const id = matchChannel(name, tvgId);
  if (!id) return null;
  const arr = store.progs.get(id);
  if (!arr) return null;
  const i = arr.findIndex(p => p.start <= now && now < p.stop);
  const current = i >= 0 ? arr[i] : null;
  const next = arr.filter(p => p.start >= (current ? current.stop : now)).slice(0, 3);
  if (!current && !next.length) return null;
  return { id, current, next, icon: store.channels.get(id)?.icon || null };
}

const fmt = ms => new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

function describe(info) {
  if (!info) return '';
  const lines = [];
  if (info.current) {
    const c = info.current;
    lines.push(`▶️ Agora (${fmt(c.start)}–${fmt(c.stop)}): ${c.title}${c.sub ? ' — ' + c.sub : ''}`);
    if (c.desc) lines.push(c.desc);
  }
  if (info.next.length) {
    lines.push('', '⏭️ A seguir:');
    info.next.forEach(p => lines.push(`• ${fmt(p.start)} ${p.title}${p.sub ? ' — ' + p.sub : ''}`));
  }
  return lines.join('\n');
}

const shortNow = info => (info && info.current ? `Agora: ${info.current.title}` : '');

module.exports = { loadEPG, parseStream, getNowNext, describe, shortNow, normalize, parseXMLTV, _store: () => store };
                                     

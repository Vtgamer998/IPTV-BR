// Testa os links: quem manda dados e CORTA em poucos segundos (stream de 30s) é marcado como "cut"
// e deixa de aparecer no catálogo. Roda no GitHub Actions. Resultados em data/checked.json.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TEST_MS = +(process.env.TEST_MS || 45000);   // quanto tempo observar cada link
const CUT_MS = +(process.env.CUT_MS || 38000);     // terminou antes disso (com dados) = corta
const BUDGET_MS = +(process.env.BUDGET_MS || 4 * 3600e3); // tempo máximo total desta execução
const LANES = +(process.env.LANES || 200);        // hosts testados ao mesmo tempo
const FILE = 'data/checked.json';
const PUB = process.env.PUB || 'public';

const h = u => createHash('sha1').update(u).digest('hex').slice(0, 10);
const checked = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};

const urls = new Set();
for (const f of readdirSync(`${PUB}/d`)) {
  const d = JSON.parse(readFileSync(`${PUB}/d/${f}`, 'utf8'));
  for (const k in d) for (const [, u] of d[k][3]) urls.add(u);
}
const todo = [...urls].filter(u => /^https?:/i.test(u) && !(h(u) in checked));
console.log(`Links no catálogo: ${urls.size} | já testados: ${urls.size - todo.length} | a testar: ${todo.length}`);

async function test(url) {
  const ctl = new AbortController();
  const start = Date.now();
  let got = 0;
  const timer = setTimeout(() => ctl.abort(), TEST_MS);
  try {
    const res = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'User-Agent': 'VLC/3.0.20 LibVLC/3.0.20' } });
    if (!res.ok) return 'unknown';
    const type = res.headers.get('content-type') || '';
    if (/\.m3u8(\?|$)/i.test(url) || /mpegurl/i.test(type)) {
      const t = await res.text();
      return t.includes('#EXTM3U') && !t.includes('#EXT-X-ENDLIST') ? 'ok' : 'unknown';
    }
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      got += value.length;
    }
    return got > 0 && Date.now() - start < CUT_MS ? 'cut' : 'unknown';
  } catch {
    if (ctl.signal.aborted) return got > 0 ? 'ok' : 'unknown'; // passou do tempo de teste com dados = ok
    return got > 0 && Date.now() - start < CUT_MS ? 'cut' : 'unknown';
  } finally { clearTimeout(timer); }
}

// um link por vez em cada servidor (não derruba contas com limite de conexões)
const byHost = new Map();
for (const u of todo) { let host = ''; try { host = new URL(u).host; } catch {} (byHost.get(host) || byHost.set(host, []).get(host)).push(u); }
const lanes = [...byHost.values()];
const deadline = Date.now() + BUDGET_MS;
let done = 0, cut = 0, ok = 0;

async function lane(list) {
  for (const u of list) {
    if (Date.now() + TEST_MS > deadline) return;
    const r = await test(u);
    if (r !== 'unknown') { checked[h(u)] = r; r === 'cut' ? cut++ : ok++; }
    if (++done % 200 === 0) console.log(`${done}/${todo.length} (ok ${ok}, cortam ${cut})`);
  }
}
let next = 0;
await Promise.all(Array.from({ length: Math.min(LANES, lanes.length) }, async () => {
  while (next < lanes.length) await lane(lanes[next++]);
}));

mkdirSync('data', { recursive: true });
writeFileSync(FILE, JSON.stringify(checked));
console.log(`Fim: testados ${done}, ok ${ok}, cortam ${cut}. Total guardado: ${Object.keys(checked).length}`);

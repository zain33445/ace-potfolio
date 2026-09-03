// Pick the most topically-related siblings for each live post, using TF-IDF
// cosine similarity over the post bodies. Raw word overlap is useless here —
// every post is about construction estimating, so common vocabulary carries no
// signal. IDF weighting is what separates "warehouse" from "the".
import fs from 'node:fs';

const content = JSON.parse(fs.readFileSync('content.json', 'utf8'));
const rows = JSON.parse(fs.readFileSync('rows.json', 'utf8'));
const live = new Set(JSON.parse(fs.readFileSync('live-slugs.json', 'utf8')));

const ALIAS = {
  '%f0%9f%8f%a8-hotel-development-services-in-usa-building-the-future-of-hospitality':
    'hotel-development-services-in-usa-building-the-future-of-hospitality',
  '%f0%9f%a7%ae-quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects':
    'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects',
};

const STOP = new Set(
  `this that with from your they have will more than been what when where which
   these those your you our their them then some such about into over your also
   because while very much many most other another each every both able just
   only even still take takes taking make makes making need needs needed help
   helps helped work works working used using uses well know knows known
   through between across before after during within without across upon
   should would could must does done doing being were was are can may might
   here there their они`.split(/\s+/),
);

const titleBy = {};
rows.forEach((r) => (titleBy[ALIAS[r.slug] ?? r.slug] = r.title));

function tokens(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^a-z ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

const docs = content
  .map((p) => ({ slug: ALIAS[p.slug] ?? p.slug, words: tokens(p.content.rendered) }))
  .filter((d) => live.has(d.slug));

// Document frequency
const df = new Map();
for (const d of docs) for (const w of new Set(d.words)) df.set(w, (df.get(w) ?? 0) + 1);

const N = docs.length;
for (const d of docs) {
  const tf = new Map();
  for (const w of d.words) tf.set(w, (tf.get(w) ?? 0) + 1);
  const vec = new Map();
  let norm = 0;
  for (const [w, n] of tf) {
    const idf = Math.log(N / df.get(w));
    if (idf <= 0) continue; // appears in every post — no signal
    const v = (1 + Math.log(n)) * idf;
    vec.set(w, v);
    norm += v * v;
  }
  d.vec = vec;
  d.norm = Math.sqrt(norm);
}

function cos(a, b) {
  const [small, big] = a.vec.size < b.vec.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [w, v] of small.vec) {
    const o = big.vec.get(w);
    if (o) dot += v * o;
  }
  return dot / (a.norm * b.norm);
}

const related = {};
for (const d of docs) {
  const scored = docs
    .filter((o) => o.slug !== d.slug)
    .map((o) => ({ slug: o.slug, score: cos(d, o) }))
    .sort((x, y) => y.score - x.score);
  related[d.slug] = scored.slice(0, 3);
}

fs.writeFileSync(
  'related.json',
  JSON.stringify(
    Object.fromEntries(Object.entries(related).map(([k, v]) => [k, v.map((x) => x.slug)])),
    null,
    1,
  ),
);

const allScores = Object.values(related).flat().map((x) => x.score);
console.log('posts:', docs.length);
console.log(
  'similarity of chosen siblings — min/median/max:',
  Math.min(...allScores).toFixed(3),
  allScores.sort((a, b) => a - b)[Math.floor(allScores.length / 2)].toFixed(3),
  Math.max(...allScores).toFixed(3),
);
console.log('\nSpot check:\n');
for (const slug of [
  'how-to-read-construction-blueprints',
  'construction-change-order-causes-prevention',
  'mep-coordination-clash-detection',
  'accurate-construction-estimating',
  'professional-hotels-development-services-in-usa',
]) {
  console.log(titleBy[slug]);
  for (const r of related[slug]) console.log(`   ${r.score.toFixed(3)}  ${titleBy[r.slug]}`);
  console.log();
}

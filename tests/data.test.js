// Content checks for shared/js/data.js: the real range and prices, filled collections, honest claims, and every
// asset path existing in both site folders. Run from the project root: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
delete globalThis.PAKNIL;
require(path.join(ROOT, 'shared', 'js', 'data.js'));
const { data } = globalThis.PAKNIL;
const SITES = ['site-a-citarasa-istana', 'site-b-ingat-rendang'];

test('nine products with the prices from rendangpaknil.com', () => {
  assert.deepEqual(data.products.map((p) => p.id), ['minang', 'dendeng', 'daging', 'ayam', 'paru', 'ayam-special', 'sambal', 'laksa', 'kacang']);
  const price = Object.fromEntries(data.products.flatMap((p) => p.sizes.map((z) => [`${p.id}-${z.g}`, z.price])));
  assert.deepEqual(price, {
    'minang-500': 48, 'minang-1000': 85, 'dendeng-1000': 80, 'daging-500': 36, 'daging-1000': 66,
    'ayam-500': 32, 'ayam-1000': 60, 'paru-500': 32, 'paru-1000': 60, 'ayam-special-1000': 30,
    'sambal-1000': 28, 'laksa-1000': 30, 'kacang-1000': 28
  });
  for (const p of data.products) {
    for (const k of ['name', 'short', 'en', 'word', 'line', 'lineBm']) assert.ok(p[k], `${p.id}.${k}`);
    for (const k of ['pop', 'deep', 'tint', 'on', 'flood', 'ink']) assert.match(p.color[k], /^#[0-9A-F]{6}$/i, `${p.id}.color.${k}`);
    assert.equal(p.notes.length, 3, `${p.id} has three taste notes`);
    assert.equal(p.notesBm.length, 3, `${p.id} has three BM notes`);
    assert.ok(['rendang', 'kuah'].includes(p.group));
  }
  assert.equal(data.products.filter((p) => p.group === 'rendang').length, 6);
});

test('content collections are filled', () => {
  assert.equal(data.claims.length, 6);
  assert.equal(data.steps.length, 3);
  assert.ok(data.faqs.length >= 15);
  assert.deepEqual([...new Set(data.faqs.map((f) => f.cat))].sort(), ['business', 'order', 'prep', 'product', 'trust']);
  assert.equal(data.quiz.length, 3);
  for (const q of data.quiz) assert.equal(q.options.length, 3);
  assert.equal(data.moments.length, 5);
  assert.equal(data.reviews.length, 5);
  assert.ok(data.media.reels.length >= 10);
  assert.equal(data.bundles.every((b) => b.placeholder === true), true, 'bundle prices are flagged as placeholders');
});

test('no halal certification claim: the packs show the Muslim-made and BeSS marks only', () => {
  const text = JSON.stringify(data);
  assert.doesNotMatch(text, /JAKIM|MS1500|halal[- ]certified|certified halal|disahkan halal/i);
  const halal = data.faqs.find((f) => /halal/i.test(f.q));
  assert.match(halal.a, /Produk Keluaran Muslim/);
  assert.match(halal.a, /BeSS/);
});

test('moments are named by the occasion or time of day, never by a clock time', () => {
  const CLOCK = /\b\d{1,2}([:.]\d{2})?\s?(am|pm)\b|\b\d{1,2}[:.]\d{2}\b/i;
  for (const m of data.moments) {
    assert.match(m.when, /^[A-Z][a-z]+( [a-z]+)*$/, `${m.id} needs a plain name like "Lunch time"`);
    assert.doesNotMatch(`${m.when} ${m.title} ${m.text}`, CLOCK, `${m.id} mentions a clock time`);
    assert.ok(data.products.some((p) => p.id === m.pair), `${m.id} pairs with a product`);
  }
});

test('the chat-facing contact details match the website and packs', () => {
  assert.equal(data.links.waNumber, '601169825208');
  assert.equal(data.brand.email, 'rendangwarisanistana@gmail.com');
  assert.match(data.links.tiktok, /tiktok\.com\/@rendangpaknil$/);
});

for (const site of SITES) {
  test(`[${site}] every asset path in data exists`, () => {
    const paths = [];
    const walk = (v) => {
      if (typeof v === 'string' && /^(img|video|packs)\//.test(v)) paths.push(v.startsWith('packs/') ? 'img/' + v : v);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(data);
    assert.ok(paths.length > 40, `found ${paths.length} paths`);
    for (const p of paths) assert.ok(fs.existsSync(path.join(ROOT, site, 'assets', p)), `${site}: missing assets/${p}`);
  });
}

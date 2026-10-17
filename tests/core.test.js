// Unit tests for the DOM-free logic shared by both concepts (shared/js/core.js).
// Run from the project root: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

function load() {
  delete globalThis.PAKNIL;
  for (const f of ['data.js', 'core.js']) {
    const p = path.join(__dirname, '..', 'shared', 'js', f);
    delete require.cache[require.resolve(p)];
    require(p);
  }
  return globalThis.PAKNIL;
}
const { core, data } = load();
const decodeWa = (href) => decodeURIComponent(href.split('?text=')[1]);

test('money formats ringgit the way the client’s shop does (RM48.00)', () => {
  assert.equal(core.money(48), 'RM48.00');
  assert.equal(core.money(0), 'RM0.00');
  assert.equal(core.money(0.1 + 0.2), 'RM0.30');
  assert.equal(core.money(1234.5), 'RM1,234.50');
  assert.equal(core.money(-4), '-RM4.00');
});

test('sizeLabel prints grams and kilos', () => {
  assert.equal(core.sizeLabel(500), '500 g');
  assert.equal(core.sizeLabel(1000), '1 kg');
});

test('skus: one per product size plus bundles, with the real prices', () => {
  const list = core.skus(data);
  const map = core.skuMap(data);
  assert.equal(list.filter((s) => s.kind === 'pack').length, 13);
  assert.equal(map['minang-500'].price, 48);
  assert.equal(map['minang-1000'].price, 85);
  assert.equal(map['dendeng-1000'].price, 80);
  assert.equal(map['daging-500'].price, 36);
  assert.equal(map['kacang-1000'].price, 28);
  assert.equal(map['minang-1000'].label, 'Rendang Minang Pak Nil 1 kg');
  assert.equal(map['set-raya'].kind, 'bundle');
  assert.equal(map['set-raya'].placeholder, true);
  assert.equal(core.fromPrice(data), 28);
});

test('cart add merges lines, clamps to 99 and ignores bad quantities', () => {
  let c = core.cartAdd([], 'minang-500');
  c = core.cartAdd(c, 'minang-500', 2);
  c = core.cartAdd(c, 'kacang-1000', 1);
  assert.deepEqual(c, [{ id: 'minang-500', qty: 3 }, { id: 'kacang-1000', qty: 1 }]);
  assert.deepEqual(core.cartAdd(c, 'minang-500', 500)[0], { id: 'minang-500', qty: 99 });
  assert.deepEqual(core.cartAdd(c, 'minang-500', -2), c);
  assert.deepEqual(core.cartAdd(c, '', 1), c);
  assert.equal(core.cartCount(c), 4);
});

test('cart set and remove never mutate the input', () => {
  const c = [{ id: 'ayam-500', qty: 2 }, { id: 'paru-1000', qty: 1 }];
  const frozen = JSON.stringify(c);
  assert.deepEqual(core.cartSet(c, 'ayam-500', 5), [{ id: 'ayam-500', qty: 5 }, { id: 'paru-1000', qty: 1 }]);
  assert.deepEqual(core.cartSet(c, 'ayam-500', 0), [{ id: 'paru-1000', qty: 1 }]);
  assert.deepEqual(core.cartRemove(c, 'paru-1000'), [{ id: 'ayam-500', qty: 2 }]);
  assert.equal(JSON.stringify(c), frozen);
});

test('cartParse keeps only known ids with usable quantities', () => {
  const ids = core.skus(data).map((s) => s.id);
  const raw = JSON.stringify([{ id: 'minang-500', qty: 2 }, { id: 'nope', qty: 1 }, { id: 'minang-500', qty: '3' }, { qty: 4 }, { id: 'sambal-1000', qty: 0 }]);
  assert.deepEqual(core.cartParse(raw, ids), [{ id: 'minang-500', qty: 5 }]);
  assert.deepEqual(core.cartParse('not json', ids), []);
  assert.deepEqual(core.cartParse('{"a":1}', ids), []);
});

test('cart lines and subtotal add up in cents', () => {
  const map = core.skuMap(data);
  const lines = core.cartLines([{ id: 'minang-500', qty: 2 }, { id: 'laksa-1000', qty: 1 }, { id: 'gone', qty: 3 }], map);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].total, 96);
  assert.equal(core.cartSubtotal(lines), 126);
});

test('bundleTotal takes the percentage off only once the set is complete', () => {
  assert.deepEqual(core.bundleTotal([48, 28], 3, 5), { full: 76, price: 76, saved: 0, done: false });
  assert.deepEqual(core.bundleTotal([48, 28, 36], 3, 5), { full: 112, price: 106.4, saved: 5.6, done: true });
});

test('orderMessage is a ready WhatsApp message in BM with items, sizes and the total', () => {
  const lines = core.cartLines([{ id: 'minang-1000', qty: 1 }, { id: 'set-raya', qty: 1 }], core.skuMap(data));
  const msg = core.orderMessage(lines, { name: 'Aisyah', area: 'Gombak', date: 'Sabtu' });
  assert.match(msg, /^Assalamualaikum Rendang Pak Nil!/);
  assert.match(msg, /• 1 × Rendang Minang Pak Nil 1 kg — RM85\.00/);
  assert.match(msg, /• 1 × Set Pagi Raya \(Rendang Minang 500 g \+ Kuah Kacang 1 kg\) — RM72\.00/);
  assert.match(msg, /Jumlah: RM157\.00/);
  assert.match(msg, /Nama: Aisyah/);
  assert.match(msg, /Hantar ke: Gombak/);
  const href = core.waLink(data.links.waNumber, msg);
  assert.ok(href.startsWith('https://wa.me/601169825208?text='));
  assert.equal(decodeWa(href), msg);
});

test('agent and bulk messages list only the fields that were filled in', () => {
  const a = core.agentMessage({ name: 'Faiz', phone: '012-345 6789', area: 'Shah Alam', channel: 'WhatsApp groups', freezer: '' });
  assert.match(a, /menjadi agen/);
  assert.match(a, /Cara jualan: WhatsApp groups/);
  assert.doesNotMatch(a, /Peti sejuk beku/);
  const b = core.bulkMessage({ event: 'Kenduri kahwin', guests: '300', items: ['Rendang Daging 1 kg × 10'], name: 'Lina' });
  assert.match(b, /tempahan pukal/);
  assert.match(b, /Menu:\n• Rendang Daging 1 kg × 10/);
  assert.match(b, /Hubungi: Lina/);
  assert.match(core.helloMessage({ name: 'Ali', message: 'Ada stok?' }), /Nama: Ali\n\nAda stok\?/);
});

test('faqSearch matches every word, ignores case and accents, and filters by topic', () => {
  assert.ok(core.faqSearch(data.faqs, 'HALAL').some((f) => /halal/i.test(f.q)));
  assert.ok(core.faqSearch(data.faqs, 'microwave wok').length >= 1);
  assert.equal(core.faqSearch(data.faqs, 'zzzz').length, 0);
  assert.ok(core.faqSearch(data.faqs, '', 'order').every((f) => f.cat === 'order'));
  assert.equal(core.normalize('Café  Rendang!'), 'cafe rendang');
});

test('filterSkus and sortSkus', () => {
  const list = core.skus(data);
  assert.equal(core.filterSkus(list, data, 'rendang').length, 10);
  assert.equal(core.filterSkus(list, data, 'kuah').length, 3);
  assert.equal(core.filterSkus(list, data, 'chicken').length, 2);
  assert.equal(core.filterSkus(list, data, 'offal').length, 3);
  assert.equal(core.filterSkus(list, data, '500').length, 4);
  assert.equal(core.filterSkus(list, data, 'bundle').length, 1);
  assert.equal(core.filterSkus(list, data, 'all').length, list.length);
  const asc = core.sortSkus(list, 'price-asc').map((s) => s.price);
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
  assert.deepEqual(core.sortSkus(list, 'featured'), list);
});

test('resolveProduct falls back to a valid product and size', () => {
  assert.deepEqual(core.resolveProduct('?p=ayam&s=1000', data), { product: 'ayam', size: 1000, valid: true });
  assert.deepEqual(core.resolveProduct('?p=dendeng&s=500', data), { product: 'dendeng', size: 1000, valid: false });
  assert.deepEqual(core.resolveProduct('?p=nope', data), { product: 'minang', size: 500, valid: false });
  assert.deepEqual(core.resolveProduct('', data), { product: 'minang', size: 500, valid: false });
});

test('quizResult returns the highest-scoring rendang', () => {
  assert.equal(core.quizResult([{ dendeng: 3 }, { minang: 1 }], data), 'dendeng');
  assert.equal(core.quizResult([{ paru: 3, 'ayam-special': 3 }, { paru: 2 }], data), 'paru');
  assert.equal(core.quizResult([], data), 'minang');
  for (const q of data.quiz) for (const o of q.options) for (const k of Object.keys(o.score)) {
    assert.ok(data.products.some((p) => p.id === k && p.group === 'rendang'), `quiz scores a rendang id: ${k}`);
  }
});

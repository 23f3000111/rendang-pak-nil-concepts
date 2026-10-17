// Page integrity for both concepts and the chooser: the Concept B generator, built pages that are fresh, one <h1>,
// every local reference resolving, data hooks pointing at real content, and file:// safe scripts.
// Run from the project root: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('../tools/pages.js');

const ROOT = path.join(__dirname, '..');
const A = 'site-a-citarasa-istana';
const B = gen.SITES['site-b'];
delete globalThis.PAKNIL;
require(path.join(ROOT, 'shared', 'js', 'data.js'));
require(path.join(ROOT, 'shared', 'js', 'core.js'));
const { data, core } = globalThis.PAKNIL;
const SKUS = core.skuMap(data);

const localRefs = (html) => [...html.matchAll(/\s(?:src|href|poster|data-lightbox|data-poster|data-reel)="([^"]+)"/g)].map((m) => m[1])
  .filter((ref) => !/^(https?:|mailto:|tel:|#|javascript:|data:|\$\{|\{)/.test(ref))
  .map((ref) => decodeURI(ref.split('#')[0].split('?')[0]).replace(/&amp;/g, '&'))
  .filter(Boolean);

test('parsePage reads the JSON meta comment and the body', () => {
  const p = gen.parsePage('<!--{"title":"Shop","nav":"shop"}-->\n<section>hi</section>');
  assert.equal(p.meta.title, 'Shop');
  assert.equal(p.meta.nav, 'shop');
  assert.equal(p.body.trim(), '<section>hi</section>');
});

test('render fills partials, meta (escaped), content and scripts, and marks the current nav link', () => {
  const layout = '<title>{{title}}</title>{{> header}}<main id="main">{{content}}</main>{{scripts}}';
  const partials = { header: '<a data-nav="index" href="index.html">Home</a><a data-nav="shop" href="shop.html">Shop</a>' };
  const html = gen.render(layout, partials, { meta: { title: 'Shop & "more"', nav: 'shop', scripts: ['rempah'] }, body: '<p>x</p>' }, 'shop.html');
  assert.match(html, /<title>Shop &amp; &quot;more&quot;<\/title>/);
  assert.match(html, /data-nav="shop" aria-current="page"/);
  assert.doesNotMatch(html, /data-nav="index" aria-current/);
  assert.match(html, /<main id="main"><p>x<\/p><\/main>/);
  assert.match(html, /<script defer src="assets\/js\/rempah\.js"><\/script>/);
});

test('render fails loudly on an unknown partial', () => {
  assert.throws(() => gen.render('{{> nope}}', {}, { meta: {}, body: '' }, 'x.html'), /Unknown partial: nope/);
});

const srcPages = path.join(ROOT, 'src', 'site-b', 'pages');
for (const file of fs.readdirSync(srcPages).filter((f) => f.endsWith('.html'))) {
  const out = path.join(ROOT, B, file);
  test(`[${B}] ${file} is built fresh, has one h1 and only resolvable local references`, () => {
    assert.ok(fs.existsSync(out), `missing ${out} (run: node tools/pages.js)`);
    const html = fs.readFileSync(out, 'utf8');
    assert.equal(gen.renderFile('site-b', file), html, 'stale page (run: node tools/pages.js)');
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'exactly one <h1>');
    assert.match(html, /<main id="main"/);
    assert.doesNotMatch(html, /type="module"/);
    for (const ref of localRefs(html)) assert.ok(fs.existsSync(path.join(ROOT, B, ref)), `${file}: missing local file ${ref}`);
  });
  test(`[${B}] ${file}: pop-ups, quick views and add buttons point at real content`, () => {
    const html = fs.readFileSync(out, 'utf8');
    const find = { claims: data.claims, moments: data.moments, products: data.products, roles: data.agent.roles };
    for (const [, kind, id] of html.matchAll(/data-info="(\w+):([\w-]+)"/g)) {
      assert.ok(find[kind] && find[kind].some((x) => x.id === id), `${file}: data-info ${kind}:${id}`);
    }
    for (const [, id] of html.matchAll(/data-(?:quick|add)="([\w-]+)"/g)) {
      assert.ok(SKUS[id] || data.products.some((p) => p.id === id), `${file}: unknown sku ${id}`);
    }
    for (const [, id, g] of html.matchAll(/product\.html\?p=([\w-]+)&amp;s=(\d+)/g)) {
      const p = data.products.find((x) => x.id === id);
      assert.ok(p && p.sizes.some((z) => z.g === Number(g)), `${file}: product link ${id} ${g}`);
    }
  });
}

for (const file of fs.readdirSync(path.join(ROOT, A)).filter((f) => f.endsWith('.html'))) {
  test(`[${A}] ${file} has a title, an h1, no pitch chrome and only resolvable local references`, () => {
    const html = fs.readFileSync(path.join(ROOT, A, file), 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.ok((html.match(/<h1[\s>]/g) || []).length >= 1, 'has an <h1>');
    assert.doesNotMatch(html, /type="module"|data-feature=|tour-toggle|demo-bar/);
    for (const ref of localRefs(html)) assert.ok(fs.existsSync(path.join(ROOT, A, ref)), `${file}: missing local file ${ref}`);
  });
}

test('the chooser links both concepts and every local reference resolves', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const dir of [A, B]) assert.match(html, new RegExp(`href="${dir}/index\\.html"`), `chooser links ${dir}`);
  const refs = [...html.matchAll(/\s(?:src|href)="([^"]+)"|url\(([^)]+)\)/g)].map((m) => m[1] || m[2]);
  assert.ok(refs.length > 8, 'chooser has local references');
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;
    assert.ok(fs.existsSync(path.join(ROOT, decodeURI(ref.split('#')[0].split('?')[0]))), `index.html: missing local file ${ref}`);
  }
});

test('no site script uses fetch() or ES modules (file:// safe)', () => {
  for (const dir of [A, B]) {
    const js = path.join(ROOT, dir, 'assets', 'js');
    for (const f of fs.readdirSync(js).filter((n) => n.endsWith('.js'))) {
      const src = fs.readFileSync(path.join(js, f), 'utf8');
      assert.doesNotMatch(src, /\bfetch\(/, `${dir}/${f} uses fetch`);
      assert.doesNotMatch(src, /^\s*(import|export)\s/m, `${dir}/${f} uses ES modules`);
    }
  }
});

test('the shared files in both sites match shared/js (run: node tools/sync.js)', () => {
  for (const dir of [A, B]) {
    for (const f of ['data.js', 'core.js']) {
      assert.equal(fs.readFileSync(path.join(ROOT, dir, 'assets', 'js', f), 'utf8'), fs.readFileSync(path.join(ROOT, 'shared', 'js', f), 'utf8'), `${dir}/${f} is out of date`);
    }
  }
});

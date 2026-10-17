/* Rendang Pak Nil · Concept B · shop: the bag (localStorage), the bag drawer, product cards from <template>s,
   filters + sort, the quick-view pop-up and the product page (product.html?p=minang&s=500).
   Every product has its own sizes (500 g and/or 1 kg); pure maths lives in core.js. */
(function () {
  'use strict';
  var P = window.PAKNIL, $ = P.$, $$ = P.$$, core = P.core, data = P.data, text = P.setText, asset = P.asset;
  var doc = document, html = doc.documentElement;
  var KEY = html.getAttribute('data-store') || 'pn-b-bag';
  var LIST = core.skus(data), MAP = core.skuMap(data), IDS = LIST.map(function (s) { return s.id; });
  var PROD = {};
  data.products.forEach(function (p) { PROD[p.id] = p; });
  var BUNDLE = {};
  (data.bundles || []).forEach(function (b) { BUNDLE[b.id] = b; });
  var BUNDLES = LIST.filter(function (s) { return s.kind === 'bundle'; });
  var size = core.sizeLabel;
  var shop = P.shop = {};

  var themeVars = function (el, p) {
    if (!el || !p) return;
    var c = p.color;
    el.style.setProperty('--c-pop', c.pop); el.style.setProperty('--c-deep', c.deep);
    el.style.setProperty('--c-tint', c.tint); el.style.setProperty('--c-on', c.on);
    el.setAttribute('data-product', p.id);
  };
  shop.themeVars = themeVars;
  /* "Rendang Minang Pak Nil" -> kicker "Rendang", name "Minang Pak Nil"; "Kuah Kacang" -> "Kuah", "Kacang" */
  var kicker = shop.kicker = function (p) { return p.group === 'kuah' ? 'Kuah' : 'Rendang'; };
  var shortName = shop.shortName = function (p) { return p.name.replace(/^(Rendang|Kuah) /, ''); };
  var priceText = function (s) { return core.money(s.price) + (s.placeholder ? '*' : ''); };
  var skuFor = shop.skuFor = function (pid, g) { return MAP[pid + '-' + g]; };
  var firstSku = shop.firstSku = function (pid) { var p = PROD[pid]; return p ? skuFor(pid, p.sizes[0].g) : null; };
  var productHref = shop.productHref = function (s) { return s.kind === 'bundle' ? 'shop.html#' + s.id : 'product.html?p=' + s.product + '&s=' + s.size; };
  var skuLabel = function (s) { return s.kind === 'bundle' ? s.name : s.name + ' ' + size(s.size); };
  /* the kitchen's own line is "one pack serves 2 to 4"; the 1 kg packs are pitched at kenduri tables */
  var serves = function (g) { return g === 500 ? 'Feeds 2 to 4' : 'Kenduri size'; };
  var askLink = function (what) { return core.waLink(data.links.waNumber, 'Assalamualaikum Rendang Pak Nil! Saya nak tanya tentang ' + what + '.'); };
  shop.askLink = askLink;

  /* size toggles are drawn per product: one size shows as a plain label */
  var drawSizes = function (wrap, p, g) {
    if (!wrap) return;
    while (wrap.firstChild) wrap.removeChild(wrap.firstChild);
    wrap.hidden = !p;
    if (!p) return;
    wrap.classList.toggle('sizes--one', p.sizes.length === 1);
    p.sizes.forEach(function (z) {
      var el;
      if (p.sizes.length === 1) { el = doc.createElement('span'); el.className = 'sizes__one'; }
      else { el = doc.createElement('button'); el.type = 'button'; el.setAttribute('data-g', z.g); el.setAttribute('aria-pressed', String(z.g === g)); }
      el.textContent = size(z.g);
      wrap.appendChild(el);
    });
  };

  /* ---------------------------------------------------------------- bag */
  var items = [];
  try { items = core.cartParse(localStorage.getItem(KEY), IDS); } catch (e) { items = []; }
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* private mode */ } };
  var changed = function () {
    save();
    renderBag();
    doc.dispatchEvent(new CustomEvent('pn:bag', { detail: { count: core.cartCount(items) } }));
  };
  P.bag = {
    items: function () { return items.slice(); },
    add: function (id, qty, el) {
      var s = MAP[id];
      if (!s) return;
      var n = qty == null ? 1 : qty;
      items = core.cartAdd(items, id, n);
      changed();
      doc.dispatchEvent(new CustomEvent('pn:add', { detail: { id: id, el: el || null, img: asset(s.img) } }));
      P.ui.toast('Added ' + (n > 1 ? n + ' × ' : '') + skuLabel(s) + ' to your bag');
    },
    set: function (id, qty) { items = core.cartSet(items, id, qty); changed(); },
    remove: function (id) { items = core.cartRemove(items, id); changed(); },
    clear: function () { items = []; changed(); },
    count: function () { return core.cartCount(items); },
    lines: function () { return core.cartLines(items, MAP); }
  };
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { items = core.cartParse(e.newValue, IDS); renderBag(); }
  });

  var bagMessageOpts = function () {
    var bag = $('#bag');
    var val = function (n) { var f = bag && $('[name="' + n + '"]', bag); return f ? f.value.trim() : ''; };
    return { name: val('bag-name'), area: val('bag-area'), date: val('bag-date') };
  };
  var checkoutHref = function () {
    return core.waLink(data.links.waNumber, core.orderMessage(P.bag.lines(), bagMessageOpts()));
  };
  function renderBag() {
    var count = core.cartCount(items), lines = P.bag.lines();
    $$('[data-bag-count]').forEach(function (el) { text(el, count); el.toggleAttribute('data-empty', !count); });
    $$('[data-bag-items]').forEach(function (el) { text(el, count + (count === 1 ? ' pack' : ' packs')); });
    var bag = $('#bag');
    if (!bag) return;
    var list = $('[data-bag-list]', bag), tpl = $('#tpl-bag-line');
    if (list && tpl) {
      while (list.firstChild) list.removeChild(list.firstChild);
      lines.forEach(function (l) {
        var node = tpl.content.firstElementChild.cloneNode(true);
        var s = MAP[l.id];
        node.setAttribute('data-id', l.id);
        if (s.product) themeVars(node, PROD[s.product]); else node.setAttribute('data-product', 'bundle');
        var img = $('[data-slot="img"]', node);
        if (img) { img.src = asset(l.img); img.alt = l.name; }
        text($('[data-slot="name"]', node), l.name);
        text($('[data-slot="label"]', node), s.size ? size(s.size) : l.label);
        text($('[data-slot="unit"]', node), priceText(s));
        text($('[data-slot="total"]', node), core.money(l.total));
        text($('[data-slot="qty"]', node), l.qty);
        list.appendChild(node);
      });
      if (P.hydrateIcons) P.hydrateIcons(list);
    }
    text($('[data-bag-subtotal]', bag), core.money(core.cartSubtotal(lines)));
    var hasPlaceholder = lines.some(function (l) { return l.placeholder; });
    $$('[data-bag-note]', bag).forEach(function (n) { n.hidden = !hasPlaceholder; });
    $$('[data-bag-empty]', bag).forEach(function (n) { n.hidden = !!count; });
    $$('[data-bag-full]', bag).forEach(function (n) { n.hidden = !count; });
    $$('[data-bag-checkout]', bag).forEach(function (a) { a.href = checkoutHref(); });
  }
  doc.addEventListener('input', function (e) {
    if (e.target.closest('#bag') && /^bag-/.test(e.target.name || '')) $$('#bag [data-bag-checkout]').forEach(function (a) { a.href = checkoutHref(); });
  });
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-bag-step],[data-bag-remove],[data-bag-clear]');
    if (!t) return;
    if (t.hasAttribute('data-add')) {
      e.preventDefault();
      var card = t.closest('[data-sku]');
      var id = t.getAttribute('data-add') || (card && card.getAttribute('data-sku'));
      P.bag.add(id, 1, card ? ($('img', card) || card) : t);
      return;
    }
    var line = t.closest('[data-id]'), lid = line && line.getAttribute('data-id');
    if (t.hasAttribute('data-bag-step') && lid) {
      var cur = (items.filter(function (it) { return it.id === lid; })[0] || { qty: 0 }).qty;
      P.bag.set(lid, cur + Number(t.getAttribute('data-bag-step')));
    } else if (t.hasAttribute('data-bag-remove') && lid) {
      P.bag.remove(lid);
    } else if (t.hasAttribute('data-bag-clear')) {
      P.bag.clear();
    }
  });

  /* -------------------------------------------------------------- cards */
  var fillCard = function (node, s) {
    var p = s.product ? PROD[s.product] : null, b = BUNDLE[s.id];
    node.setAttribute('data-sku', s.id);
    node.setAttribute('data-kind', s.kind);
    if (p) themeVars(node, p); else node.setAttribute('data-product', 'bundle');
    var img = $('[data-slot="img"]', node), img2 = $('[data-slot="img2"]', node);
    if (img) { img.src = asset(s.img); img.alt = p ? p.name + ' ' + size(s.size) + ' pack' : b.label; }
    if (img2) {
      var second = b && MAP[b.contains[1]];
      img2.hidden = !second;
      if (second) { img2.src = asset(second.img); img2.alt = ''; }
    }
    text($('[data-slot="kicker"]', node), p ? kicker(p) : 'Set');
    text($('[data-slot="name"]', node), p ? shortName(p) : b.name);
    text($('[data-slot="tag"]', node), p ? p.tagBm : 'Untuk pagi Raya');
    text($('[data-slot="en"]', node), p ? p.en : b.label);
    text($('[data-slot="price"]', node), priceText(s));
    var badge = $('[data-slot="badge"]', node), badgeText = p ? p.badge : 'Proposed set';
    if (badge) { badge.hidden = !badgeText; text(badge, badgeText); }
    $$('[data-slot="link"]', node).forEach(function (a) { a.href = productHref(s); });
    $$('[data-quick]', node).forEach(function (q) { q.setAttribute('data-quick', s.id); q.setAttribute('aria-label', 'Quick view: ' + (p ? p.name : b.name)); });
    $$('[data-add]', node).forEach(function (a) { a.setAttribute('aria-label', 'Add ' + skuLabel(s) + ' to your bag'); });
    drawSizes($('[data-size]', node), p, s.size);
  };
  shop.renderCards = function (container, skus) {
    var tpl = $('#' + (container.getAttribute('data-template') || 'tpl-card'));
    if (!tpl) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    skus.forEach(function (s, i) {
      var node = tpl.content.firstElementChild.cloneNode(true);
      fillCard(node, s);
      node.style.setProperty('--i', i);
      container.appendChild(node);
    });
    if (P.hydrateIcons) P.hydrateIcons(container);
    container.dispatchEvent(new CustomEvent('pn:cards', { bubbles: true }));
  };
  /* one card per product at its first size (plus the set); a size filter shows every product sold in that size */
  var defaults = function () { return data.products.map(function (p) { return firstSku(p.id); }); };
  var inSize = function (g) {
    return data.products.filter(function (p) { return p.sizes.some(function (z) { return z.g === g; }); }).map(function (p) { return skuFor(p.id, g); });
  };
  shop.cardList = function (filter, sort) {
    var out;
    if (filter === '500' || filter === '1000') out = inSize(Number(filter));
    else if (filter === 'bundle') out = BUNDLES.slice();
    else if (!filter || filter === 'all') out = defaults().concat(BUNDLES);
    else out = core.filterSkus(defaults(), data, filter);
    return core.sortSkus(out, sort || 'popular');
  };
  $$('[data-products]').forEach(function (c) {
    var kind = c.getAttribute('data-products'), ids = c.getAttribute('data-ids');
    var skus = ids ? ids.split(',').map(function (id) { return MAP[id] || firstSku(id); }).filter(Boolean) : shop.cardList(kind);
    shop.renderCards(c, skus);
  });
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-size] button[data-g]');
    if (!b) return;
    e.preventDefault();
    var card = b.closest('[data-sku]'), s = MAP[card.getAttribute('data-sku')];
    var next = s && skuFor(s.product, Number(b.getAttribute('data-g')));
    if (next) { fillCard(card, next); card.dispatchEvent(new CustomEvent('pn:size', { bubbles: true })); }
  });

  /* ------------------------------------------------------ filters + sort */
  var applyFilters = function (group) {
    var target = $(group.getAttribute('data-filters'));
    if (!target) return;
    var on = $('[data-filter][aria-pressed="true"]', group);
    var sortEl = $('[data-sort]', group) || $('[data-sort]');
    var skus = shop.cardList(on ? on.getAttribute('data-filter') : 'all', sortEl ? sortEl.value : 'popular');
    target.classList.add('is-filtering');
    setTimeout(function () {
      shop.renderCards(target, skus);
      target.classList.remove('is-filtering');
      $$('[data-count-shown]').forEach(function (el) { text(el, skus.length + (skus.length === 1 ? ' product' : ' products')); });
      if (P.fx && P.fx.popIn) P.fx.popIn(target.children);
    }, P.env.reduce ? 0 : 180);
  };
  $$('[data-filters]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      $$('[data-filter]', group).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      applyFilters(group);
    });
    var sel = $('[data-sort]', group);
    if (sel) sel.addEventListener('change', function () { applyFilters(group); });
  });

  /* ---------------------------------------------------------- quick view */
  var quickState = { id: null };
  var fillQuick = function (s) {
    var box = $('#dlg-quick');
    if (!box) return;
    quickState.id = s.id;
    var p = s.product ? PROD[s.product] : null, b = BUNDLE[s.id];
    box.style.cssText = '';
    if (p) themeVars(box, p); else box.setAttribute('data-product', 'bundle');
    box.setAttribute('data-kind', s.kind);
    var img = $('[data-q="img"]', box);
    if (img) { img.src = asset(p ? p.img.pack : b.img); img.alt = p ? p.name + ' pack' : b.label; }
    text($('[data-q="kicker"]', box), p ? p.en : 'Proposed Raya set');
    text($('[data-q="name"]', box), p ? p.name : b.name);
    text($('[data-q="tag"]', box), p ? p.tagBm : 'Pagi Raya dalam satu pesanan');
    text($('[data-q="blurb"]', box), p ? p.line : b.blurb);
    text($('[data-q="serves"]', box), p ? serves(s.size) : 'Two packs, one Raya table');
    text($('[data-q="price"]', box), priceText(s));
    var badge = $('[data-q="badge"]', box);
    if (badge) { badge.hidden = !(p && p.badge); text(badge, p && p.badge); }
    drawSizes($('[data-q-size]', box), p, s.size);
    var qty = $('[data-q-qty]', box);
    if (qty) qty.value = 1;
    var link = $('[data-q-link]', box);
    if (link) { link.href = productHref(s); link.hidden = !p; }
    $$('[data-q-ask]', box).forEach(function (a) { a.href = askLink(skuLabel(s)); });
    $$('[data-q-note]', box).forEach(function (n) { n.hidden = !s.placeholder; });
  };
  shop.quick = function (id, opener) {
    var s = MAP[id] || firstSku(id);
    if (!s) return;
    fillQuick(s);
    P.ui.open('dlg-quick', opener);
  };
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-quick],[data-q-size] button[data-g],[data-q-step],[data-q-add]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-quick')) { shop.quick(t.getAttribute('data-quick'), t); return; }
    var s = MAP[quickState.id];
    var qty = $('#dlg-quick [data-q-qty]');
    if (t.hasAttribute('data-g') && s) { var n = skuFor(s.product, Number(t.getAttribute('data-g'))); if (n) fillQuick(n); return; }
    if (t.hasAttribute('data-q-step') && qty) { qty.value = Math.max(1, Math.min(99, (Number(qty.value) || 1) + Number(t.getAttribute('data-q-step')))); return; }
    if (t.hasAttribute('data-q-add') && s) {
      P.bag.add(s.id, qty ? Math.max(1, Math.min(99, Number(qty.value) || 1)) : 1, $('#dlg-quick [data-q="img"]'));
      P.ui.close();
    }
  });
  var hashQuick = function () {
    var h = decodeURIComponent(location.hash.slice(1));
    if (doc.body.classList.contains('page-shop') && (MAP[h] || PROD[h])) shop.quick(h);
  };
  window.addEventListener('hashchange', hashQuick);
  setTimeout(hashQuick, 700);

  /* -------------------------------------------------------- product page */
  var initProduct = function () {
    if (!doc.body.classList.contains('page-product')) return;
    var r = core.resolveProduct(location.search, data);
    var state = { p: PROD[r.product], g: r.size };
    if (location.search && !r.valid) setTimeout(function () { P.ui.toast('Showing ' + state.p.name + ' ' + size(state.g)); }, 900);
    var pp = function (k) { return $$('[data-pp="' + k + '"]'); };
    var draw = function () {
      var p = state.p, s = skuFor(p.id, state.g);
      themeVars(html, p);
      doc.title = p.name + ' ' + size(state.g) + ' | Rendang Pak Nil';
      var vals = { name: p.name, kicker: kicker(p), short: shortName(p), en: p.en, tag: p.tagBm, line: p.line, lineBm: p.lineBm,
        word: p.word, price: priceText(s), label: size(state.g), badge: p.badge || '', serves: serves(state.g),
        per: core.money(s.price / s.size * 100) + ' per 100 g' };
      Object.keys(vals).forEach(function (k) { pp(k).forEach(function (el) { text(el, vals[k]); }); });
      pp('badge').forEach(function (el) { el.hidden = !p.badge; });
      pp('img').forEach(function (img) { img.src = asset(p.img.pack); img.alt = p.name + ' ' + size(state.g) + ' pack'; });
      $$('[data-pp-zoom]').forEach(function (b) { b.setAttribute('data-lightbox', asset(p.img.pack)); b.setAttribute('data-caption', p.name + ', ' + size(state.g)); });
      pp('dish').forEach(function (img) { img.src = asset(p.img.dish); img.alt = p.name + ', served'; });
      $$('[data-pp-dish]').forEach(function (b) { b.setAttribute('data-lightbox', asset(p.img.dish)); b.setAttribute('data-caption', p.name); });
      pp('clip').forEach(function (v) { var src = asset(p.img.clip); if (v.getAttribute('src') !== src) { v.src = src; v.poster = asset(p.img.clipPoster); } });
      $$('[data-pp-clip]').forEach(function (b) { b.setAttribute('data-lightbox', asset(p.img.clip)); b.setAttribute('data-poster', asset(p.img.clipPoster)); b.setAttribute('data-caption', p.name + ', from their product reel'); });
      pp('notes').forEach(function (ul) {
        while (ul.firstChild) ul.removeChild(ul.firstChild);
        p.notes.forEach(function (n, i) {
          var li = doc.createElement('li'), b = doc.createElement('b'), sm = doc.createElement('span');
          b.textContent = n; sm.textContent = p.notesBm[i] || '';
          li.appendChild(b); li.appendChild(sm); ul.appendChild(li);
        });
      });
      pp('pairs').forEach(function (ul) {
        while (ul.firstChild) ul.removeChild(ul.firstChild);
        p.pairs.forEach(function (n) { var li = doc.createElement('li'); li.className = 'chip'; li.textContent = n; ul.appendChild(li); });
      });
      $$('[data-pp-warisan]').forEach(function (el) {
        var w = (p.warisan || [])[0];
        el.hidden = !w;
        if (!w) return;
        el.setAttribute('data-lightbox', asset('img/' + w));
        el.setAttribute('data-caption', 'The new Warisan × PakNil pouch for ' + p.name + ', first shown at MIHAS 2026');
        var im = $('img', el); if (im) { im.src = asset('img/' + w.replace('.webp', '-sm.webp')); im.alt = 'New Warisan × PakNil pouch: ' + p.name; }
      });
      pp('placeholder').forEach(function (el) { el.hidden = !s.placeholder; });
      drawSizes($('[data-pp-size]'), p, state.g);
      $$('[data-pp-add]').forEach(function (b) { b.setAttribute('data-sku', s.id); });
      $$('[data-pp-ask]').forEach(function (a) { a.href = askLink(p.name + ' ' + size(state.g)); });
      var i = data.products.indexOf(p), next = data.products[(i + 1) % data.products.length];
      $$('[data-pp-next]').forEach(function (a) {
        a.href = 'product.html?p=' + next.id + '&s=' + next.sizes[0].g;
        themeVars(a, next);
        text($('[data-slot="kicker"]', a), kicker(next));
        text($('[data-slot="name"]', a), shortName(next));
        text($('[data-slot="tag"]', a), next.tagBm);
        var im = $('img', a); if (im) { im.src = asset(next.img.sm); im.alt = next.name; }
      });
      $$('[data-pp-others]').forEach(function (c) {
        var others = data.products.filter(function (x) { return x.id !== p.id; });
        others.sort(function (a, b) { return (a.group === p.group ? 0 : 1) - (b.group === p.group ? 0 : 1); });
        shop.renderCards(c, others.slice(0, 4).map(function (x) { return firstSku(x.id); }));
      });
      var m = (data.moments || []).filter(function (x) { return x.pair === p.id || x.pair2 === p.id; })[0];
      $$('[data-pp-moment]').forEach(function (el) {
        el.hidden = !m;
        if (!m) return;
        el.setAttribute('data-info', 'moments:' + m.id);
        text($('[data-slot="time"]', el), m.whenBm);
        text($('[data-slot="title"]', el), m.title);
        text($('[data-slot="text"]', el), m.text);
        var im = $('img', el); if (im) { im.src = asset(m.img); im.alt = m.title; }
      });
      html.dispatchEvent(new CustomEvent('pn:product', { bubbles: true, detail: { product: p.id, size: state.g } }));
    };
    draw();
    doc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pp-size] button[data-g]');
      if (b) {
        e.preventDefault();
        state.g = Number(b.getAttribute('data-g'));
        history.replaceState(null, '', 'product.html?p=' + state.p.id + '&s=' + state.g);
        draw();
        return;
      }
      var st = e.target.closest('[data-pp-step]'), qty = $('[data-pp-qty]');
      if (st && qty) { e.preventDefault(); qty.value = Math.max(1, Math.min(99, (Number(qty.value) || 1) + Number(st.getAttribute('data-pp-step')))); return; }
      var add = e.target.closest('[data-pp-add]');
      if (add) { e.preventDefault(); P.bag.add(add.getAttribute('data-sku'), qty ? Math.max(1, Math.min(99, Number(qty.value) || 1)) : 1, $('[data-pp="img"]')); }
    });
  };
  initProduct();
  renderBag();
}());

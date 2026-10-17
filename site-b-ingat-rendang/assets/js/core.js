/* Rendang Pak Nil · pure logic shared by both concepts (no DOM).
   Browser: window.PAKNIL.core · Node tests: globalThis.PAKNIL.core
   Money, SKUs, the bag (cart), WhatsApp / e-mail messages, FAQ search, product URLs, bundle maths, quiz. */
(function (root) {
  'use strict';
  var P = root.PAKNIL = root.PAKNIL || {};
  var MAX = 99;

  /* ------------------------------------------------------------ money */
  var cents = function (n) { return Math.round(Number(n) * 100) || 0; };
  var money = function (n) {
    var c = cents(n), neg = c < 0;
    c = Math.abs(c);
    var whole = String(Math.floor(c / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + 'RM' + whole + '.' + ('0' + (c % 100)).slice(-2);
  };
  var sizeLabel = function (g) { return g >= 1000 ? (g / 1000) + ' kg' : g + ' g'; };

  /* ------------------------------------------------------------- SKUs */
  var skus = function (data) {
    var list = [];
    data.products.forEach(function (p) {
      p.sizes.forEach(function (z) {
        list.push({ id: p.id + '-' + z.g, kind: 'pack', product: p.id, size: z.g, name: p.name,
          label: p.name + ' ' + sizeLabel(z.g), price: z.price, placeholder: !!z.placeholder, img: p.img.sm, group: p.group });
      });
    });
    (data.bundles || []).forEach(function (b) {
      list.push({ id: b.id, kind: 'bundle', product: null, size: null, name: b.name, label: b.label,
        price: b.price, placeholder: !!b.placeholder, img: b.img, group: 'bundle' });
    });
    return list;
  };
  var skuMap = function (data) {
    var m = {};
    skus(data).forEach(function (s) { m[s.id] = s; });
    return m;
  };
  var fromPrice = function (data) {
    return Math.min.apply(null, data.products.map(function (p) {
      return Math.min.apply(null, p.sizes.map(function (z) { return z.price; }));
    }));
  };

  /* -------------------------------------------------------------- bag */
  var clamp = function (q) {
    q = Math.floor(Number(q));
    return isFinite(q) && q > 0 ? Math.min(MAX, q) : 0;
  };
  var copy = function (items) { return (items || []).map(function (it) { return { id: it.id, qty: it.qty }; }); };
  var cartAdd = function (items, id, qty) {
    var add = qty == null ? 1 : clamp(qty), out = copy(items), hit = false;
    if (!id || !add) return out;
    out.forEach(function (it) { if (it.id === id) { it.qty = clamp(it.qty + add); hit = true; } });
    if (!hit) out.push({ id: id, qty: add });
    return out;
  };
  var cartSet = function (items, id, qty) {
    var q = clamp(qty);
    return copy(items).map(function (it) { if (it.id === id) it.qty = q; return it; })
      .filter(function (it) { return it.qty > 0; });
  };
  var cartRemove = function (items, id) { return copy(items).filter(function (it) { return it.id !== id; }); };
  var cartCount = function (items) { return (items || []).reduce(function (n, it) { return n + it.qty; }, 0); };
  /* storage can hold anything (old versions, hand edits): keep only known ids with a usable quantity */
  var cartParse = function (raw, validIds) {
    var arr;
    try { arr = JSON.parse(raw); } catch (e) { return []; }
    if (!Array.isArray(arr)) return [];
    var out = [];
    arr.forEach(function (it) {
      if (!it || typeof it.id !== 'string') return;
      if (validIds && validIds.indexOf(it.id) === -1) return;
      var q = clamp(it.qty);
      if (q) out = cartAdd(out, it.id, q);
    });
    return out;
  };
  var cartLines = function (items, map) {
    return (items || []).filter(function (it) { return map[it.id]; }).map(function (it) {
      var s = map[it.id];
      return { id: it.id, kind: s.kind, size: s.size, name: s.name, label: s.label, img: s.img, qty: it.qty,
        unit: s.price, total: cents(s.price) * it.qty / 100, placeholder: s.placeholder };
    });
  };
  var cartSubtotal = function (lines) {
    return (lines || []).reduce(function (c, l) { return c + cents(l.total); }, 0) / 100;
  };

  /* ------------------------------------------- set builder (Concept A) */
  /* pick any `need` packs, `pct` percent off their single-pack total (proposed offer, placeholder) */
  var bundleTotal = function (prices, need, pct) {
    var full = (prices || []).reduce(function (c, p) { return c + cents(p); }, 0);
    var done = (prices || []).length >= need;
    var off = done ? Math.round(full * (pct || 0) / 100) : 0;
    return { full: full / 100, price: (full - off) / 100, saved: off / 100, done: done };
  };

  /* --------------------------------------------------------- messages */
  var waLink = function (number, text) {
    return 'https://wa.me/' + String(number || '').replace(/\D/g, '') + (text ? '?text=' + encodeURIComponent(text) : '');
  };
  var mailtoLink = function (to, subject, body) {
    return 'mailto:' + to + '?subject=' + encodeURIComponent(subject || '') + '&body=' + encodeURIComponent(body || '');
  };
  var lineName = function (l) { return l.size ? l.name + ' ' + sizeLabel(l.size) : l.name + ' (' + l.label + ')'; };
  var orderMessage = function (lines, o) {
    o = o || {};
    var rows = ['Assalamualaikum Rendang Pak Nil! Saya nak buat pesanan:', ''];
    lines.forEach(function (l) { rows.push('• ' + l.qty + ' × ' + lineName(l) + ' — ' + money(l.total)); });
    rows.push('', 'Jumlah: ' + money(cartSubtotal(lines)));
    if (o.name) rows.push('Nama: ' + o.name);
    if (o.area) rows.push('Hantar ke: ' + o.area);
    if (o.date) rows.push('Tarikh: ' + o.date);
    if (o.note) rows.push('Catatan: ' + o.note);
    rows.push('', '(Dihantar dari laman web Rendang Pak Nil)');
    return rows.join('\n');
  };
  var field = function (rows, label, v) { if (v) rows.push(label + ': ' + v); };
  var agentMessage = function (f) {
    var rows = ['Assalamualaikum Rendang Pak Nil, saya berminat untuk menjadi agen.', ''];
    field(rows, 'Nama', f.name);
    field(rows, 'Telefon', f.phone);
    field(rows, 'Kawasan', f.area);
    field(rows, 'Cara jualan', f.channel);
    field(rows, 'Peti sejuk beku', f.freezer);
    field(rows, 'Anggaran sebulan', f.volume);
    field(rows, 'Catatan', f.note);
    return rows.join('\n');
  };
  var bulkMessage = function (f) {
    var rows = ['Assalamualaikum Rendang Pak Nil, ini pertanyaan tempahan pukal.', ''];
    field(rows, 'Majlis', f.event);
    field(rows, 'Tarikh', f.date);
    field(rows, 'Bilangan tetamu', f.guests);
    if (f.items && f.items.length) {
      rows.push('Menu:');
      f.items.forEach(function (i) { rows.push('• ' + i); });
    }
    field(rows, 'Kawasan', f.area);
    field(rows, 'Hubungi', [f.name, f.phone, f.email].filter(Boolean).join(', '));
    field(rows, 'Catatan', f.note);
    return rows.join('\n');
  };
  var helloMessage = function (f) {
    var rows = ['Assalamualaikum Rendang Pak Nil!', ''];
    field(rows, 'Nama', f.name);
    if (f.message) rows.push('', f.message);
    return rows.join('\n');
  };

  /* ------------------------------------------------------- FAQ search */
  var normalize = function (s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9%]+/g, ' ').trim();
  };
  var faqSearch = function (faqs, query, cat) {
    var words = normalize(query).split(' ').filter(Boolean);
    return (faqs || []).filter(function (f) {
      if (cat && cat !== 'all' && f.cat !== cat) return false;
      var hay = normalize(f.q + ' ' + f.a);
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  };

  /* --------------------------------------------- shop filters + sorting */
  var filterSkus = function (list, data, filter) {
    var prot = {};
    data.products.forEach(function (p) { prot[p.id] = p.protein; });
    var test = {
      rendang: function (s) { return s.kind === 'pack' && s.group === 'rendang'; },
      kuah: function (s) { return s.kind === 'pack' && s.group === 'kuah'; },
      beef: function (s) { return s.kind === 'pack' && prot[s.product] === 'beef'; },
      chicken: function (s) { return s.kind === 'pack' && prot[s.product] === 'chicken'; },
      offal: function (s) { return s.kind === 'pack' && prot[s.product] === 'offal'; },
      500: function (s) { return s.size === 500; },
      1000: function (s) { return s.size === 1000; },
      bundle: function (s) { return s.kind === 'bundle'; }
    }[filter];
    return test ? list.filter(test) : list.slice();
  };
  var sortSkus = function (list, mode) {
    var indexed = list.map(function (s, i) { return { s: s, i: i }; });
    var dir = mode === 'price-asc' ? 1 : mode === 'price-desc' ? -1 : 0;
    indexed.sort(function (a, b) { return (dir && (a.s.price - b.s.price) * dir) || a.i - b.i; });
    return indexed.map(function (x) { return x.s; });
  };

  /* ------------------------------------------------ product page + quiz */
  var resolveProduct = function (search, data) {
    var q = new URLSearchParams(search || ''), id = q.get('p'), g = Number(q.get('s'));
    var p = data.products.filter(function (x) { return x.id === id; })[0];
    var prod = p || data.products[0];
    var sizes = prod.sizes.map(function (z) { return z.g; });
    var okSize = sizes.indexOf(g) > -1;
    return { product: prod.id, size: okSize ? g : sizes[0], valid: !!p && okSize };
  };
  var quizResult = function (picks, data) {
    var ids = data.products.filter(function (p) { return p.group === 'rendang'; }).map(function (p) { return p.id; });
    var score = {};
    ids.forEach(function (id) { score[id] = 0; });
    (picks || []).forEach(function (p) {
      Object.keys(p || {}).forEach(function (k) { if (k in score) score[k] += Number(p[k]) || 0; });
    });
    return ids.reduce(function (best, id) { return score[id] > score[best] ? id : best; }, ids[0]);
  };

  P.core = {
    money: money, sizeLabel: sizeLabel, skus: skus, skuMap: skuMap, fromPrice: fromPrice,
    cartAdd: cartAdd, cartSet: cartSet, cartRemove: cartRemove, cartCount: cartCount, cartParse: cartParse,
    cartLines: cartLines, cartSubtotal: cartSubtotal, bundleTotal: bundleTotal, waLink: waLink, mailtoLink: mailtoLink,
    orderMessage: orderMessage, agentMessage: agentMessage, bulkMessage: bulkMessage, helloMessage: helloMessage,
    normalize: normalize, faqSearch: faqSearch, resolveProduct: resolveProduct, quizResult: quizResult,
    filterSkus: filterSkus, sortSkus: sortSkus
  };
}(typeof window !== 'undefined' ? window : globalThis));

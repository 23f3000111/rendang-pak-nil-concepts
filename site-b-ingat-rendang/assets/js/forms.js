/* Rendang Pak Nil · Concept B · forms, FAQ and quiz.
   form[data-form="hello|agent|bulk"] validates inline and opens a ready-made WhatsApp (or e-mail) message;
   nothing is posted anywhere. [data-faq-list] renders data.faqs with live search and topic chips.
   [data-quiz] runs "Rendang mana satu awak?". */
(function () {
  'use strict';
  var P = window.PAKNIL, $ = P.$, $$ = P.$$, core = P.core, data = P.data, text = P.setText, asset = P.asset;
  var doc = document;
  var PROD = {};
  data.products.forEach(function (p) { PROD[p.id] = p; });

  /* -------------------------------------------------------------- forms */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var fieldError = function (input, msg) {
    var wrap = input.closest('.field') || input.parentElement;
    var err = $('.field-error', wrap);
    if (!err) { err = doc.createElement('p'); err.className = 'field-error'; err.id = (input.id || input.name) + '-error'; wrap.appendChild(err); }
    err.textContent = msg || '';
    err.hidden = !msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
  };
  var validate = function (form) {
    var first = null;
    $$('input, select, textarea', form).forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'hidden' || el.type === 'range' || el.disabled) return;
      var v = el.value.trim(), msg = '';
      if (el.required && !v) msg = 'Please fill this in.';
      else if (v && el.type === 'email' && !EMAIL.test(v)) msg = 'That e-mail address does not look right.';
      else if (v && el.type === 'tel' && v.replace(/\D/g, '').length < 9) msg = 'Please enter a phone number we can reach, with the area code.';
      fieldError(el, msg);
      if (msg && !first) first = el;
    });
    var group = $('[data-require-one]', form);
    if (group) {
      var any = $$('input[type="checkbox"]:checked', group).length > 0;
      var note = $('[data-require-one-error]', form);
      if (note) note.hidden = any;
      if (!any && !first) first = $('input[type="checkbox"]', group);
    }
    if (first) { first.focus(); return false; }
    return true;
  };
  var val = function (form, name) { var el = form.elements[name]; return el && el.value ? String(el.value).trim() : ''; };
  var packs = function (guests) { var n = Math.max(1, Number(guests) || 0); return { lo: Math.ceil(n / 8), hi: Math.ceil(n / 4) }; };
  var build = {
    hello: function (f) {
      return { subject: 'Hello from the website', body: core.helloMessage({ name: val(f, 'name'),
        message: [val(f, 'message'), val(f, 'phone') && 'Telefon: ' + val(f, 'phone'), val(f, 'email') && 'E-mel: ' + val(f, 'email')].filter(Boolean).join('\n') }) };
    },
    agent: function (f) {
      return { subject: 'Agent application: ' + val(f, 'name'), body: core.agentMessage({ name: val(f, 'name'), phone: val(f, 'phone'),
        area: val(f, 'area'), channel: val(f, 'sell'), freezer: val(f, 'freezer'), volume: val(f, 'volume'), note: val(f, 'note') }) };
    },
    bulk: function (f) {
      var items = $$('input[name="menu"]:checked', f).map(function (cb) { return PROD[cb.value].name + ' (1 kg)'; });
      var est = packs(val(f, 'guests'));
      return { subject: 'Kenduri order: ' + (val(f, 'event') || 'Rendang Pak Nil'), body: core.bulkMessage({ event: val(f, 'event'), date: val(f, 'date'),
        guests: val(f, 'guests') + ' (anggaran ' + est.lo + '–' + est.hi + ' pek 1 kg)', items: items, area: val(f, 'area'),
        name: val(f, 'name'), phone: val(f, 'phone'), email: val(f, 'email'), note: val(f, 'note') }) };
    }
  };
  $$('form[data-form]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') fieldError(e.target, ''); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var kind = form.getAttribute('data-form'), msg = build[kind](form);
      var channel = (form.elements.channel && form.elements.channel.value) || 'whatsapp';
      var href = channel === 'email' ? core.mailtoLink(data.brand.email, msg.subject, msg.body) : core.waLink(data.links.waNumber, msg.body);
      var done = $('[data-form-done]', form);
      if (done) {
        done.hidden = false;
        var again = $('a', done);
        if (again) again.href = href;
      }
      form.classList.add('is-sent');
      form.dispatchEvent(new CustomEvent('pn:sent', { bubbles: true, detail: { kind: kind, href: href } }));
      if (channel === 'email') window.location.href = href;
      else window.open(href, '_blank', 'noopener');
    });
  });

  /* kenduri estimate: the brand says one pack serves 2 to 4, so a 1 kg pack is counted as 4 to 8 plates */
  $$('[data-guests]').forEach(function (input) {
    var form = input.form, out = form && $('[data-guests-out]', form), est = form && $('[data-estimate]', form);
    var upd = function () {
      var n = Math.max(1, Number(input.value) || 0), e = packs(n);
      text(out, n + ' guests');
      text(est, e.lo === e.hi ? e.lo + ' packs of 1 kg' : e.lo + ' to ' + e.hi + ' packs of 1 kg');
    };
    input.addEventListener('input', upd);
    upd();
  });

  /* ---------------------------------------------------------------- FAQ */
  var CATS = { product: 'The rendang', prep: 'Heating & storage', trust: 'Halal & kitchen', order: 'Ordering', business: 'Agents & kenduri' };
  P.faqCats = CATS;
  $$('[data-faq-list]').forEach(function (list) {
    var tpl = $('#tpl-faq');
    if (!tpl) return;
    var only = (list.getAttribute('data-cat') || '').split(',').filter(Boolean);
    var limit = Number(list.getAttribute('data-limit')) || 0;
    var faqs = data.faqs.filter(function (f) { return !only.length || only.indexOf(f.cat) > -1; });
    if (limit) faqs = faqs.slice(0, limit);
    var nodes = faqs.map(function (f, i) {
      var node = tpl.content.firstElementChild.cloneNode(true);
      node.setAttribute('data-cat', f.cat);
      node.style.setProperty('--i', i);
      text($('[data-slot="q"]', node), f.q);
      text($('[data-slot="a"]', node), f.a);
      text($('[data-slot="cat"]', node), CATS[f.cat]);
      list.appendChild(node);
      return node;
    });
    if (P.hydrateIcons) P.hydrateIcons(list);
    var root = list.closest('[data-faq]') || doc;
    var search = $('[data-faq-search]', root), empty = $('[data-faq-empty]', root), count = $('[data-faq-count]', root);
    var cat = 'all';
    var apply = function () {
      var hits = core.faqSearch(faqs, search ? search.value : '', cat);
      nodes.forEach(function (n, i) { n.hidden = hits.indexOf(faqs[i]) === -1; });
      if (empty) empty.hidden = hits.length > 0;
      if (count) text(count, hits.length + (hits.length === 1 ? ' answer' : ' answers'));
      if (search && search.value && hits.length === 1) { var one = nodes[faqs.indexOf(hits[0])]; if (!one.open) one.open = true; }
    };
    if (search) search.addEventListener('input', apply);
    $$('[data-faq-cat]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.getAttribute('data-faq-cat');
        $$('[data-faq-cat]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        apply();
      });
    });
    var reset = $('[data-faq-reset]', root);
    if (reset) reset.addEventListener('click', function () { if (search) search.value = ''; cat = 'all'; $$('[data-faq-cat]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-faq-cat') === 'all')); }); apply(); });
    apply();
  });

  /* --------------------------------------------------------------- quiz */
  $$('[data-quiz]').forEach(function (root) {
    var stage = $('[data-quiz-stage]', root), result = $('[data-quiz-result]', root), dots = $('[data-quiz-dots]', root);
    if (!stage) return;
    var picks = [];
    var showStep = function (i) {
      var q = data.quiz[i];
      while (stage.firstChild) stage.removeChild(stage.firstChild);
      var kicker = doc.createElement('p'); kicker.className = 'quiz__kicker'; kicker.textContent = 'Question ' + (i + 1) + ' of ' + data.quiz.length;
      var h = doc.createElement('h3'); h.className = 'quiz__q'; h.textContent = q.qBm;
      var en = doc.createElement('p'); en.className = 'quiz__en'; en.textContent = q.q;
      var opts = doc.createElement('div'); opts.className = 'quiz__opts';
      q.options.forEach(function (o, k) {
        var b = doc.createElement('button');
        b.type = 'button'; b.className = 'quiz__opt'; b.style.setProperty('--i', k);
        var l = doc.createElement('strong'); l.textContent = o.label;
        var s = doc.createElement('span'); s.textContent = o.sub;
        b.appendChild(l); b.appendChild(s);
        b.addEventListener('click', function () {
          picks[i] = o.score;
          if (i + 1 < data.quiz.length) showStep(i + 1); else finish();
        });
        opts.appendChild(b);
      });
      stage.appendChild(kicker); stage.appendChild(h); stage.appendChild(en); stage.appendChild(opts);
      stage.hidden = false;
      if (result) result.hidden = true;
      if (dots) $$('i', dots).forEach(function (d, k) { d.classList.toggle('is-on', k <= i); });
      root.dispatchEvent(new CustomEvent('pn:quiz-step', { bubbles: true, detail: { step: i } }));
    };
    var finish = function () {
      var p = PROD[core.quizResult(picks, data)];
      stage.hidden = true;
      if (!result) return;
      result.hidden = false;
      if (P.shop) P.shop.themeVars(result, p);
      text($('[data-qr="name"]', result), p.name);
      text($('[data-qr="tag"]', result), p.tagBm);
      text($('[data-qr="line"]', result), p.line);
      var img = $('[data-qr="img"]', result);
      if (img) { img.src = asset(p.img.pack); img.alt = p.name + ' pack'; }
      var add = $('[data-qr-add]', result);
      if (add) add.setAttribute('data-add', p.id + '-' + p.sizes[0].g);
      var link = $('[data-qr-link]', result);
      if (link) link.href = 'product.html?p=' + p.id + '&s=' + p.sizes[0].g;
      if (dots) $$('i', dots).forEach(function (d) { d.classList.add('is-on'); });
      root.dispatchEvent(new CustomEvent('pn:quiz', { bubbles: true, detail: { product: p.id } }));
    };
    $$('[data-quiz-restart]', root).forEach(function (b) { b.addEventListener('click', function () { picks = []; showStep(0); }); });
    showStep(0);
  });
}());

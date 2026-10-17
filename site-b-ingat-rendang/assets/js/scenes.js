/* Rendang Pak Nil · Concept B · page scenes
   The pinned "Pilih rendang anda" scene (six rendangs: the page colour morphs to each pack's label colour, the pack
   flips in 3D, spices pop, a giant outlined word sits behind, progress bars fill; tabs jump to a state), the
   scroll-driven five-minute microwave timer, and small entrance moments on every page. */
(function () {
  'use strict';
  var P = window.PAKNIL, $ = P.$, $$ = P.$$, data = P.data;
  var reduce = P.env.reduce, hasGSAP = !!window.gsap;
  var wide = window.matchMedia('(min-width: 901px)').matches;

  /* ------------------------------------------------- pilih rendang anda */
  var rendangScene = function () {
    var sec = $('[data-rendang-scene]');
    if (!sec) return;
    var tabs = $$('.rs-switch button', sec), thumb = $('.rs-switch__thumb', sec), bars = $$('.rs__progress i', sec);
    var ids = tabs.map(function (b) { return b.getAttribute('data-p'); });
    var byId = {};
    data.products.forEach(function (p) { byId[p.id] = p; });
    var el = function (sel, id) { return $(sel.replace('%', id), sec); };
    var current = null, lastSwap = 0, st = null;
    var moveThumb = function (btn) {
      if (!thumb || !btn) return;
      thumb.style.width = btn.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    };
    var setBars = function (p) { bars.forEach(function (b, k) { b.style.setProperty('--p', Math.max(0, Math.min(1, p - k)) * 100 + '%'); }); };
    if (hasGSAP) gsap.set($$('.rs__pack, .bit, .rs__word span', sec), { autoAlpha: 0 });
    var setProduct = function (id, instant) {
      if (current === id) return;
      var prev = current, p = byId[id];
      current = id;
      tabs.forEach(function (b) { var on = b.getAttribute('data-p') === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
      moveThumb(tabs[ids.indexOf(id)]);
      ids.forEach(function (k) { el('[data-panel-p="%"]', k).hidden = k !== id; });
      var pack = el('.rs__pack[data-p="%"]', id), bits = $$('.bit', el('[data-bits-p="%"]', id)), word = el('[data-word="%"]', id);
      if (!hasGSAP || reduce || instant) {
        sec.style.setProperty('--bg', p.color.pop);
        sec.style.setProperty('--on', p.color.on);
        if (hasGSAP) {
          gsap.set($$('.rs__pack, .bit, .rs__word span', sec), { autoAlpha: 0 });
          gsap.set([pack].concat(bits), { autoAlpha: 1, rotationY: 0, scale: 1, scaleX: 1 });
          gsap.set(word, { autoAlpha: 0.5 });
        }
        return;
      }
      var now = Date.now(), fast = now - lastSwap < 420;
      lastSwap = now;
      gsap.to(sec, { '--bg': p.color.pop, '--on': p.color.on, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      if (prev) {
        gsap.to(el('.rs__pack[data-p="%"]', prev), { rotationY: 90, scaleX: 0.6, autoAlpha: 0, duration: fast ? 0.14 : 0.3, ease: 'power2.in', overwrite: true });
        gsap.to($$('.bit', el('[data-bits-p="%"]', prev)), { scale: 0, autoAlpha: 0, duration: 0.25, overwrite: true });
        gsap.to(el('[data-word="%"]', prev), { autoAlpha: 0, scale: 0.92, duration: 0.3, overwrite: true });
      }
      gsap.fromTo(pack, { rotationY: -90, scaleX: 0.6, autoAlpha: 0 }, { rotationY: 0, scaleX: 1, autoAlpha: 1, duration: fast ? 0.45 : 0.95, delay: prev ? (fast ? 0.1 : 0.22) : 0, ease: 'elastic.out(1, .55)', overwrite: true });
      gsap.fromTo(bits, { scale: 0, autoAlpha: 0, rotation: -40 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.07, delay: 0.2, overwrite: true });
      gsap.fromTo(word, { autoAlpha: 0, scale: 1.15 }, { autoAlpha: 0.5, scale: 1, duration: 0.7, ease: 'power3.out', overwrite: true });
      var panel = el('[data-panel-p="%"]', id);
      gsap.fromTo(panel.children, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.6)', stagger: 0.05, overwrite: true, clearProps: 'transform' });
      if (P.fx && P.fx.pop) P.fx.pop(0.9 + ids.indexOf(id) * 0.1);
    };
    setProduct(ids[0], true);
    setBars(0.0001);
    window.addEventListener('resize', function () { moveThumb(tabs[ids.indexOf(current)]); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveThumb(tabs[ids.indexOf(current)]); });

    if (hasGSAP && !reduce && wide) {
      st = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: '+=' + ids.length * 60 + '%',
        pin: $('.rs__pin', sec),
        anticipatePin: 1,
        onUpdate: function (self) {
          var p = self.progress * ids.length;
          setProduct(ids[Math.min(ids.length - 1, Math.floor(p))]);
          setBars(p);
        }
      });
    }
    var go = function (i) {
      if (st) {
        var y = st.start + (st.end - st.start) * ((i + 0.5) / ids.length);
        if (P.lenis) P.lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        setProduct(ids[i]);
        setBars(i + 1);
      }
    };
    tabs.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
    $('.rs-switch', sec).addEventListener('keydown', function (e) {
      var i = ids.indexOf(current);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length;
        tabs[n].focus();
        go(n);
      }
    });
  };

  /* ------------------------------------------- five-minute microwave timer */
  var timer = function () {
    var t = $('.timer');
    if (!t) return;
    var digits = $('[data-timer-digits]', t);
    var show = function (sec) {
      sec = Math.max(0, Math.round(sec));
      t.classList.toggle('is-done', sec === 0);
      digits.textContent = sec === 0 ? 'SIAP!' : Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
    };
    if (!hasGSAP || reduce) { show(300); return; }
    var o = { s: 300 }, rang = false;
    show(300);
    gsap.to(o, {
      s: 0, ease: 'none',
      scrollTrigger: { trigger: t.closest('section'), start: 'top 75%', end: 'center 40%', scrub: 0.5 },
      onUpdate: function () {
        show(o.s);
        if (o.s < 0.5 && !rang) { rang = true; if (P.fx) P.fx.pop(1.4); gsap.fromTo(t, { rotate: -4 }, { rotate: 0, duration: 0.8, ease: 'elastic.out(1, .4)' }); }
        if (o.s > 2) rang = false;
      }
    });
  };

  /* ------------------------------------------------- entrance moments */
  var extras = function () {
    if (!hasGSAP || reduce) return;
    var badges = $$('.tbadge');
    if (badges.length) {
      gsap.from(badges, { scale: 0, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, .55)', stagger: { each: 0.09, from: 'random' }, scrollTrigger: { trigger: '.tbadges', start: 'top 80%', once: true } });
      badges.forEach(function (k, i) { gsap.to(k, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 }); });
    }
    $$('.fan').forEach(function (fan) {
      gsap.from($$('.fan__card', fan), { y: 140, rotation: 0, autoAlpha: 0, duration: 1, ease: 'back.out(1.5)', stagger: 0.12, scrollTrigger: { trigger: fan, start: 'top 80%', once: true } });
    });
    $$('.kenduri__photo').forEach(function (ph) {
      gsap.from(ph, { y: 110, rotation: 14, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: ph, start: 'top 85%', once: true } });
    });
    $$('.reel').forEach(function (r, i) {
      gsap.from(r, { y: 80, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.5)', delay: i * 0.07, scrollTrigger: { trigger: r.parentElement, start: 'top 85%', once: true } });
    });
    $$('.review').forEach(function (r, i) {
      gsap.from(r, { y: 60, rotation: i % 2 ? 4 : -4, autoAlpha: 0, duration: 0.85, ease: 'back.out(1.6)', delay: i * 0.06, scrollTrigger: { trigger: r.parentElement, start: 'top 85%', once: true } });
    });
    var pcards = function (root) {
      var cards = $$('.pcard', root);
      if (!cards.length) return;
      gsap.from(cards, { y: 70, autoAlpha: 0, rotation: function (i) { return i % 2 ? 3 : -3; }, duration: 0.9, ease: 'back.out(1.5)', stagger: 0.08, scrollTrigger: { trigger: root, start: 'top 85%', once: true } });
    };
    $$('[data-products], [data-pp-others]').forEach(pcards);
  };

  /* --------------------------------------------- inner-page moments */
  var inner = function () {
    if (!hasGSAP || reduce) return;
    var ph = $('.phero__title');
    if (ph) {
      gsap.from($$('.phero__w', ph), { yPercent: 110, rotation: function () { return gsap.utils.random(-14, 14); }, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, .55)', stagger: 0.08, delay: 0.1 });
      gsap.from('.phero__pack img', { scale: 0, rotation: -200, duration: 1.2, ease: 'back.out(1.8)', delay: 0.35 });
      gsap.from('.phero__note', { autoAlpha: 0, y: 20, duration: 0.6, delay: 0.8 });
    }
    var packs = $$('.bhero__packs a');
    if (packs.length) gsap.from(packs, { y: 220, autoAlpha: 0, duration: 1, ease: 'back.out(1.4)', stagger: 0.06, delay: 0.3 });
    $$('.claims').forEach(function (root) {
      root.addEventListener('pn:tab', function (e) {
        var panel = document.getElementById(e.detail.id);
        if (!panel) return;
        gsap.fromTo(panel, { scale: 0.94, rotation: -1.5 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, .6)' });
        gsap.fromTo(panel.querySelectorAll('.claim__copy > *, .claim__img'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.06 });
        if (P.fx && P.fx.pop) P.fx.pop(1.05);
      });
    });
    var path = $('.kitchen__path');
    if (path) {
      gsap.fromTo(path, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: '.kitchen__track', start: 'top 75%', end: 'bottom 55%', scrub: true } });
    }
    var bars = $$('[data-bar]');
    if (bars.length) gsap.from(bars, { scaleX: 0, duration: 1.4, ease: 'elastic.out(1, .7)', stagger: 0.25, scrollTrigger: { trigger: '.race__bars', start: 'top 80%', once: true } });
    var bowl = $('.fhero__bowl');
    if (bowl) gsap.from(bowl, { scale: 0.4, rotation: -120, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)', delay: 0.2 });
    $$('.fhero__spice, .phero__spice, .shop-hero__spice, .pp-hero__spice').forEach(function (s, i) {
      gsap.from(s, { scale: 0, autoAlpha: 0, duration: 0.9, ease: 'back.out(2.2)', delay: 0.5 + i * 0.1 });
    });
    var crew = $('.crew__photo');
    if (crew) gsap.from($$('.crew__sticker', crew), { scale: 0, rotation: -30, duration: 0.8, ease: 'back.out(2.4)', stagger: 0.15, scrollTrigger: { trigger: crew, start: 'top 75%', once: true } });
  };

  var boot = function () {
    rendangScene();
    timer();
    extras();
    inner();
    if (hasGSAP) ScrollTrigger.refresh();
  };
  if (P.fx && P.fx.ready) P.fx.ready.then(boot); else boot();
}());

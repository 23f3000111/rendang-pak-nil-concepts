/* Rendang Pak Nil · Concept B "Ingat Rendang, Ingat Pak Nil!" · motion core
   Lenis + GSAP, the first-visit "Memanaskan kuali…" loader, circle-wipe page transitions from the click point,
   reveals, counters, marquees that lean with scroll speed, idle floats, parallax, pointer tilt, fly-to-bag,
   synthesized pestle thuds and pops (with a remembered mute), and Tupat the ketupat. */
(function () {
  'use strict';
  var P = window.PAKNIL, $ = P.$, $$ = P.$$;
  var html = document.documentElement;
  var reduce = P.env.reduce, fine = P.env.fine;
  var hasGSAP = !!window.gsap;
  var fx = P.fx = {};
  window.__pnFx = true;
  html.classList.remove('fx-failed');
  if (hasGSAP) { gsap.registerPlugin(ScrollTrigger); if (window.SplitText) gsap.registerPlugin(SplitText); }

  /* -------------------------------------------------------------- sound */
  var sound = P.sound = { on: true, gestured: false, ctx: null };
  try { sound.on = localStorage.getItem('pn-b-sound') !== 'off'; } catch (e) { /* default on */ }
  var syncSound = function () { $$('.nav__sound').forEach(function (b) { b.setAttribute('aria-pressed', String(sound.on)); }); };
  syncSound();
  var mark = function () { sound.gestured = true; };
  window.addEventListener('pointerdown', mark, { once: true, capture: true });
  window.addEventListener('keydown', mark, { once: true, capture: true });
  sound.audio = function () {
    if (!sound.on || !sound.gestured) return null;
    try {
      if (!sound.ctx) sound.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (sound.ctx.state === 'suspended') sound.ctx.resume();
      return sound.ctx;
    } catch (e) { return null; }
  };
  /* a thud = the stone pestle (alu) landing in the lesung: a falling sine plus a dull, low-passed knock */
  fx.thud = function (gain) {
    var ac = sound.audio();
    if (!ac) return;
    var t = ac.currentTime, g0 = gain || 1;
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140 + Math.random() * 30, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.17);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.6 * g0, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.28);
    var n = Math.floor(ac.sampleRate * 0.07), buf = ac.createBuffer(1, n, ac.sampleRate), ch = buf.getChannelData(0);
    for (var j = 0; j < n; j++) ch[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / n, 3);
    var src = ac.createBufferSource(), lp = ac.createBiquadFilter(), g2 = ac.createGain();
    src.buffer = buf;
    lp.type = 'lowpass'; lp.frequency.value = 700 + Math.random() * 500;
    g2.gain.value = 0.55 * g0;
    src.connect(lp); lp.connect(g2); g2.connect(ac.destination);
    src.start(t);
  };
  /* a pop = short rising triangle blip (adding to the bag, buttons) */
  fx.pop = function (pitch) {
    var ac = sound.audio();
    if (!ac) return;
    var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), p = pitch || 1;
    o.type = 'triangle';
    o.frequency.setValueAtTime(330 * p, t);
    o.frequency.exponentialRampToValueAtTime(900 * p, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.22);
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.nav__sound');
    if (!b) return;
    sound.on = !sound.on;
    syncSound();
    try { localStorage.setItem('pn-b-sound', sound.on ? 'on' : 'off'); } catch (er) { /* ignore */ }
    if (sound.on) fx.thud(0.8);
    P.ui.toast(sound.on ? 'Kitchen sounds on' : 'Kitchen sounds off');
  });

  /* -------------------------------------------------------------- lenis */
  if (!reduce && window.Lenis && hasGSAP) {
    var lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
    P.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  var scrollToEl = fx.scrollTo = function (el, offset) {
    if (!el) return;
    if (P.lenis) P.lenis.scrollTo(el, { offset: offset == null ? -110 : offset, duration: 1.2 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  var setHeaderH = function () { var h = $('.site-header'); if (h) html.style.setProperty('--header-h', h.offsetHeight + 'px'); };
  setHeaderH();
  window.addEventListener('resize', setHeaderH);
  var onScroll = function () { html.classList.toggle('is-scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------- page transitions */
  var wipe = $('.wipe'), leaving = false;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (href.charAt(0) === '#') {
      if (href.length > 1) { var tgt = document.getElementById(href.slice(1)); if (tgt) { e.preventDefault(); scrollToEl(tgt); } }
      return;
    }
    if (/^(mailto|tel|javascript|https?):/i.test(href) && new URL(a.href, location.href).origin !== location.origin) return;
    var url = new URL(a.href, location.href);
    if (url.protocol !== location.protocol || (url.origin !== location.origin && location.protocol !== 'file:')) return;
    var samePage = url.pathname === location.pathname && url.search === location.search;
    if (samePage && url.hash) {
      var el = document.getElementById(url.hash.slice(1));
      if (el) { e.preventDefault(); scrollToEl(el); history.replaceState(null, '', url.hash); }
      return;
    }
    if (samePage && !url.hash) return;
    if (leaving) { e.preventDefault(); return; }
    if (!wipe || reduce || !hasGSAP) return;
    e.preventDefault();
    leaving = true;
    try { sessionStorage.setItem('pn-b-wipe', '1'); } catch (er) { /* ignore */ }
    fx.pop(0.75);
    var x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
    html.classList.add('is-leaving');
    gsap.fromTo(wipe, { clipPath: 'circle(0% at ' + x + 'px ' + y + 'px)' },
      { clipPath: 'circle(150% at ' + x + 'px ' + y + 'px)', duration: 0.7, ease: 'power3.inOut', onComplete: function () { location.href = a.href; } });
    gsap.fromTo($('.wipe__tupat', wipe), { scale: 0.3, rotate: -30, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(2.2)' });
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && wipe) {
      leaving = false;
      html.classList.remove('is-leaving', 'is-arriving');
      if (hasGSAP) gsap.set(wipe, { clipPath: 'circle(0% at 50% 50%)' });
    }
  });

  /* --------------------------------------------- intro: loader or wipe-in */
  var fontsReady = new Promise(function (res) {
    var done = false, go = function () { if (!done) { done = true; res(); } };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
    setTimeout(go, 1800);
  });
  fx.ready = new Promise(function (res) {
    var loader = $('.loader');
    var finish = function () {
      try { sessionStorage.setItem('pn-b-seen', '1'); sessionStorage.removeItem('pn-b-wipe'); } catch (e) { /* ignore */ }
      res();
    };
    if (html.classList.contains('is-loading') && loader && hasGSAP && !reduce) {
      /* spices tossed out of the kuali */
      var box = $('.loader__spices', loader), imgs = ['chilli', 'anise', 'cinnamon', 'garlic', 'leaf', 'chilli-half', 'coconut'];
      for (var i = 0; i < 16; i++) {
        var k = document.createElement('img'), name = imgs[i % imgs.length];
        k.src = 'assets/img/spices/' + name + '.webp';
        k.alt = '';
        k.style.left = (6 + Math.random() * 88) + '%';
        k.style.width = (/chilli|cinnamon/.test(name) ? 70 + Math.random() * 40 : name === 'leaf' ? 30 + Math.random() * 14 : 40 + Math.random() * 26) + 'px';
        box.appendChild(k);
        var up = innerHeight * (0.42 + Math.random() * 0.5);
        gsap.timeline({ repeat: -1, delay: Math.random() * 1.4 })
          .to(k, { y: -up, rotate: gsap.utils.random(-280, 280), duration: 0.55 + Math.random() * 0.3, ease: 'power2.out' })
          .to(k, { y: 0, rotate: '+=' + gsap.utils.random(-140, 140), duration: 0.55 + Math.random() * 0.3, ease: 'power2.in' });
      }
      var tl = gsap.timeline();
      tl.from('.loader__mark', { scale: 0.3, rotate: -10, opacity: 0, duration: 1.1, ease: 'elastic.out(1, .5)' })
        .from('.loader__note', { y: 16, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0.3)
        .to('.loader__bar i', { width: '72%', duration: 1, ease: 'power2.out' }, 0.2);
      Promise.all([fontsReady, new Promise(function (r) { setTimeout(r, 1400); })]).then(function () {
        gsap.timeline({ onComplete: function () { loader.remove(); } })
          .to('.loader__bar i', { width: '100%', duration: 0.3, ease: 'power2.in' })
          .to('.loader__mark', { scale: 1.12, duration: 0.22, ease: 'power2.in' })
          .add(function () { html.classList.remove('is-loading'); finish(); })
          .to(loader, { clipPath: 'circle(0% at 50% 50%)', duration: 0.75, ease: 'power3.inOut' }, '+=.02');
      });
    } else {
      if (loader) loader.remove();
      html.classList.remove('is-loading');
      if (html.classList.contains('is-arriving') && wipe && hasGSAP && !reduce) {
        fontsReady.then(function () {
          gsap.fromTo(wipe, { clipPath: 'circle(150% at 50% 50%)' }, {
            clipPath: 'circle(0% at 50% 50%)', duration: 0.75, ease: 'power3.inOut',
            onComplete: function () { html.classList.remove('is-arriving'); }
          });
          setTimeout(finish, 260);
        });
      } else { html.classList.remove('is-arriving'); finish(); }
    }
  });

  /* ------------------------------------------------------------ helpers */
  fx.popIn = function (els) {
    els = Array.prototype.slice.call(els || []);
    if (!hasGSAP || reduce) { els.forEach(function (e) { e.style.opacity = 1; }); return; }
    gsap.fromTo(els, { opacity: 0, y: 26, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.05, clearProps: 'transform' });
  };
  fx.burst = function (el, colors) {
    if (!hasGSAP || reduce || !el) return;
    var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    colors = colors || ['#FFB51F', '#E3262E', '#2A8540', '#7C0C1B', '#2F6FDB'];
    for (var i = 0; i < 18; i++) {
      var d = document.createElement('i'), s = 8 + Math.random() * 14;
      d.className = 'confetti';
      d.style.cssText = 'position:fixed;left:0;top:0;z-index:130;pointer-events:none;width:' + s + 'px;height:' + s + 'px;border-radius:2px;rotate:45deg;background:' + colors[i % colors.length] + ';border:2px solid #1E1410';
      document.body.appendChild(d);
      var a = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 150;
      gsap.fromTo(d, { x: cx - s / 2, y: cy - s / 2, scale: 0.3, rotate: 45 }, {
        x: cx - s / 2 + Math.cos(a) * dist, y: cy - s / 2 + Math.sin(a) * dist - 50, scale: 1, rotate: gsap.utils.random(-220, 220),
        opacity: 0, duration: 0.9 + Math.random() * 0.6, ease: 'power2.out', onComplete: d.remove.bind(d)
      });
    }
  };
  fx.flyToBag = function (src, img) {
    var bag = $$('.bag-btn').filter(function (b) { return b.offsetParent !== null; })[0];
    if (!bag || !hasGSAP || reduce || !src) return;
    var a = src.getBoundingClientRect(), b = bag.getBoundingClientRect();
    var f = document.createElement('img');
    f.src = img;
    f.alt = '';
    f.style.cssText = 'position:fixed;left:0;top:0;z-index:140;height:96px;width:auto;pointer-events:none;filter:drop-shadow(0 10px 10px rgba(30,20,16,.35))';
    document.body.appendChild(f);
    var x0 = a.left + a.width / 2 - 34, y0 = a.top + a.height / 2 - 48, x1 = b.left + b.width / 2 - 34, y1 = b.top + b.height / 2 - 48;
    gsap.set(f, { x: x0, y: y0, scale: 0.6, rotate: -10 });
    gsap.timeline({ onComplete: function () {
      f.remove();
      bag.classList.remove('is-bump');
      void bag.offsetWidth;
      bag.classList.add('is-bump');
    } })
      .to(f, { scale: 1, duration: 0.22, ease: 'back.out(2)' })
      .to(f, { x: x1, duration: 0.78, ease: 'power1.inOut' }, 0.08)
      .to(f, { y: Math.min(y0, y1) - 140, rotate: 18, duration: 0.38, ease: 'power2.out' }, 0.08)
      .to(f, { y: y1, rotate: 0, duration: 0.42, ease: 'power2.in' }, 0.46)
      .to(f, { scale: 0.2, opacity: 0, duration: 0.2 }, 0.78);
  };
  document.addEventListener('pn:add', function (e) {
    fx.pop(1.1);
    if (e.detail && e.detail.el) fx.flyToBag(e.detail.el, e.detail.img);
    tupatSay(pick(['Sedap! It is in your bag.', 'Masuk beg! Nak tambah kuah kacang?', 'Good pick. Into the freezer it goes.']), 2600, true);
  });

  /* ------------------------------------------------------------ reveals */
  if (!hasGSAP) { $$('[data-pop],[data-split]').forEach(function (e) { e.style.opacity = 1; }); }
  var reveals = function () {
    if (!hasGSAP) return;
    var pops = $$('[data-pop]');
    if (reduce) { $$('[data-pop],[data-split]').forEach(function (e) { e.style.opacity = 1; }); return; }
    if (pops.length) {
      gsap.set(pops, { opacity: 0, y: 44, scale: 0.92 });
      ScrollTrigger.batch(pops, {
        start: 'top 90%', once: true,
        onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.6)', stagger: 0.08, overwrite: true, clearProps: 'transform' }); }
      });
    }
    $$('[data-split]').forEach(function (h) {
      if (!window.SplitText) { gsap.set(h, { opacity: 1 }); return; }
      var split = new SplitText(h, { type: 'words,chars', wordsClass: 'word', charsClass: 'ltr' });
      gsap.set(h, { opacity: 1 });
      gsap.from(split.chars, {
        yPercent: 80, opacity: 0, scale: 0.5, rotate: function () { return gsap.utils.random(-18, 18); },
        duration: 0.8, ease: 'back.out(2.4)', stagger: 0.02,
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });
  };
  var counters = function () {
    $$('[data-count]').forEach(function (el) {
      var n = Number(el.getAttribute('data-count')), o = { v: 0 }, plain = el.hasAttribute('data-plain');
      var fmt = function (v) { v = Math.round(v); return plain ? String(v) : v.toLocaleString('en-MY'); };
      if (!hasGSAP || reduce) { el.textContent = fmt(n); return; }
      el.textContent = plain ? String(Math.round(n * 0.98)) : '0';
      if (plain) o.v = Math.round(n * 0.98);
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () {
        gsap.to(o, { v: n, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } });
        gsap.fromTo(el, { scale: 0.6 }, { scale: 1, duration: 1.2, ease: 'elastic.out(1, .5)' });
      } });
    });
  };
  var ambient = function () {
    if (!hasGSAP || reduce) return;
    $$('[data-float]').forEach(function (el, i) {
      var amp = Number(el.getAttribute('data-float')) || 12;
      gsap.to(el, { y: i % 2 ? amp : -amp, rotate: '+=' + (i % 2 ? 3 : -3), duration: 2.4 + (i % 4) * 0.45, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    $$('[data-par]').forEach(function (el) {
      gsap.to(el, { yPercent: Number(el.getAttribute('data-par')), ease: 'none', scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-spin]').forEach(function (el) {
      gsap.to(el, { rotate: Number(el.getAttribute('data-spin')) || 360, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.marquee__row').forEach(function (row, i) {
      var skew = gsap.quickTo(row, 'skewX', { duration: 0.4, ease: 'power3' });
      if (P.lenis) P.lenis.on('scroll', function (l) { skew(gsap.utils.clamp(-10, 10, l.velocity * (i % 2 ? -0.3 : 0.3))); });
    });
    if (fine) {
      $$('[data-tilt]').forEach(function (el) {
        var max = Number(el.getAttribute('data-tilt')) || 10;
        var rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
        el.style.transformPerspective = '900px';
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
          rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
        });
        el.addEventListener('pointerleave', function () { rx(0); ry(0); });
      });
    }
  };

  /* ------------------------------------------------------- hero entrance */
  var heroIn = function () {
    var hero = $('.hero');
    if (!hero || !hasGSAP || reduce) return;
    var tl = gsap.timeline();
    var title = $('.hero__title');
    if (window.SplitText && title) {
      var split = new SplitText(title, { type: 'chars', charsClass: 'ltr' });
      tl.from(split.chars, { yPercent: 120, scale: 0.3, rotate: function () { return gsap.utils.random(-30, 30); }, opacity: 0, duration: 1.1, ease: 'elastic.out(1, .5)', stagger: 0.03 }, 0.15);
    }
    tl.from('.hero__pill', { y: 26, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0)
      .from('.hero__note', { scale: 0, rotate: -12, opacity: 0, duration: 0.8, ease: 'back.out(2.6)' }, 0.75)
      .from('.hero__lead, .hero__cta > *, .hero__trust > *', { y: 24, opacity: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.06 }, 0.85)
      .from('.stage__sun', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.4)' }, 0.1)
      .from('.stage__paknil', { y: 200, opacity: 0, duration: 1.1, ease: 'back.out(1.3)' }, 0.25)
      .from('.stage__pack', { y: 240, opacity: 0, duration: 1.1, ease: 'back.out(1.3)', stagger: 0.12 }, 0.4)
      .from('.hero__hint', { opacity: 0, y: 12, duration: 0.6 }, 1.8);
    $$('.stage__pack').forEach(function (p, i) { gsap.to(p, { y: i % 2 ? -10 : -16, duration: 2.4 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 + i * 0.2 }); });
    gsap.to('.stage__sun', { rotate: 360, duration: 60, ease: 'none', repeat: -1 });
    if (fine) {
      var layers = [['.stage__pack--1, .stage__pack--3', 26], ['.stage__pack--2, .stage__pack--4', 18], ['.stage__paknil', 10]];
      var movers = layers.map(function (l) {
        var els = $$(l[0], hero);
        return { d: l[1], x: gsap.quickTo(els, 'x', { duration: 0.9, ease: 'power3' }), yp: gsap.quickTo(els, 'yPercent', { duration: 0.9, ease: 'power3' }) };
      });
      hero.addEventListener('pointermove', function (e) {
        var nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        movers.forEach(function (m) { m.x(nx * m.d); m.yp(ny * m.d * 0.1); });
      });
    }
    gsap.to('.hero__copy', { yPercent: 10, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__stage', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  };

  /* -------------------------------------------------------- Tupat mascot */
  var tupat = $('.tupat'), say = tupat && $('[data-tupat-say]', tupat), sayTimer = 0;
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var TIPS = [
    'Psst! Tap the falling spices to pound them.',
    'Thaw, heat, serve. Siap dalam 5 minit!',
    'Heat it in a wok without oil. Tak perlu minyak!',
    'One pack serves 2 to 4. Feeding a kenduri? Pick the 1 kg packs.',
    'Pagi Raya: rendang, kuah kacang, ketupat. Lengkap!',
    'Keep it frozen until the day you need it.',
    'Running a kedai? Ask about becoming an agent.',
    'Ingat rendang, ingat Pak Nil!'
  ];
  var tipIndex = 0;
  function tupatSay(msg, ms, quiet) {
    if (!say) return;
    say.textContent = msg;
    say.classList.add('is-on');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () { say.classList.remove('is-on'); }, ms || 3200);
    if (!quiet && tupat) { tupat.classList.remove('is-wiggle'); void tupat.offsetWidth; tupat.classList.add('is-wiggle'); }
  }
  fx.tupatSay = tupatSay;
  if (tupat) {
    tupat.addEventListener('click', function () { tupatSay(TIPS[tipIndex++ % TIPS.length]); fx.thud(0.5); });
    var pupils = $$('.eye-pupil', tupat);
    if (fine && pupils.length) {
      window.addEventListener('pointermove', function (e) {
        var r = tupat.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.5;
        var dx = e.clientX - cx, dy = e.clientY - cy, d = Math.max(1, Math.hypot(dx, dy));
        var tx = (dx / d) * 2.4, ty = (dy / d) * 2.4;
        pupils.forEach(function (p) { p.style.transform = 'translate(' + tx + 'px,' + ty + 'px)'; });
      }, { passive: true });
    }
    if (hasGSAP && !reduce) {
      fx.ready.then(function () {
        gsap.from(tupat, { y: 160, duration: 1, delay: 1.6, ease: 'back.out(1.6)' });
        gsap.to($('.tupat__arm', tupat), { rotation: -22, svgOrigin: '16 68', duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 1.4 });
        gsap.to($('.tupat__tails', tupat), { rotation: 6, svgOrigin: '50 27', duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    }
    setTimeout(function () {
      if (P.ui.current()) return;
      var hero = $('.hero');
      tupatSay(hero && window.scrollY < innerHeight * 0.6 ? TIPS[0] : 'Tap me for kitchen tips!', 4200, true);
      tipIndex = 1;
    }, 9000);
  }
  document.addEventListener('pn:quiz', function (e) {
    var p = P.data.products.filter(function (x) { return x.id === e.detail.product; })[0];
    if (p) tupatSay('Pilihan bagus! ' + p.name + ' it is.', 3600);
  });

  /* filters, FAQ search, accordions and tabs change the page height: re-measure scroll triggers when it settles */
  if (hasGSAP && 'ResizeObserver' in window) {
    var lastH = 0, rt = 0;
    new ResizeObserver(function () {
      var h = document.body.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      clearTimeout(rt);
      rt = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
    }).observe(document.body);
  }

  /* ---------------------------------------------------------------- boot */
  fontsReady.then(function () { reveals(); if (hasGSAP) ScrollTrigger.refresh(); });
  counters();
  ambient();
  Promise.all([fx.ready, fontsReady]).then(function () {
    heroIn();
    html.dispatchEvent(new CustomEvent('pn:ready'));
    if (hasGSAP) ScrollTrigger.refresh();
  });
  window.addEventListener('load', function () {
    if (hasGSAP) ScrollTrigger.refresh();
    if (location.hash && !document.body.classList.contains('page-shop')) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () { scrollToEl(el); }, 700);
    }
  });
}());

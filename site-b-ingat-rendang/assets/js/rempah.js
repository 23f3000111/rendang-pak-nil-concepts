/* Rendang Pak Nil · Concept B · Rempah rain
   Real spice cut-outs (chilli, star anise, cinnamon, garlic, lime leaf, coconut) tumble down a canvas. Hover one
   (mouse) or tap it (touch) and a stone pestle comes down: the spice squashes, bursts into crumbs, a comic word pops
   ("PEDAS!", "WANGI!", "TOK!") and a synthesized thud plays (muted with the header sound toggle). Tapping empty
   space drops a fresh spice from that spot.
   Canvas: canvas[data-rempah="<count>"] inside [data-rempah-host]. Pauses off-screen and in background tabs;
   draws one still frame under prefers-reduced-motion. */
(function () {
  'use strict';
  var P = window.PAKNIL, $$ = P.$$;
  var reduce = P.env.reduce, fine = P.env.fine;
  var KINDS = {
    chilli: { size: [110, 170], crumbs: ['#E3262E', '#B5121B', '#FF6B4A'], words: ['PEDAS!', 'SEDAP!'] },
    'chilli-half': { size: [90, 140], crumbs: ['#E3262E', '#FFE3C2', '#B5121B'], words: ['PEDAS!', 'UMPH!'] },
    cinnamon: { size: [90, 140], crumbs: ['#9A5A2E', '#7A4220', '#C98A54'], words: ['WANGI!', 'TOK!'] },
    anise: { size: [58, 92], crumbs: ['#7A3E1D', '#5A2A12', '#A0582B'], words: ['WANGI!', 'TOK!'] },
    garlic: { size: [56, 86], crumbs: ['#F4EFE6', '#E2D6C2', '#FFFFFF'], words: ['TOK!', 'UMPH!'] },
    leaf: { size: [80, 120], crumbs: ['#6FA33A', '#4E7F27', '#A6C96A'], words: ['WANGI!', 'SEDAP!'] },
    coconut: { size: [66, 100], crumbs: ['#FFFFFF', '#6B4A2E', '#F2EDE4'], words: ['LEMAK!', 'SEDAP!'] }
  };
  var INK = '#1E1410';

  var loadImg = function (src) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
  };
  /* pre-scale each sprite once so per-frame drawImage calls stay cheap */
  var bake = function (img, max) {
    var k = max / Math.max(img.width, img.height), c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  };

  function Field(canvas, host, opts) {
    this.c = canvas;
    this.g = canvas.getContext('2d');
    this.host = host;
    this.count = opts.count;
    this.sprites = opts.sprites;   /* [{c: canvas, kind: 'chilli'|...}] */
    this.spices = [];
    this.squash = [];
    this.pestles = [];
    this.puffs = [];
    this.crumbs = [];
    this.words = [];
    this.mx = -999; this.my = -999; this.lastMove = 0;
    this.running = false; this.visible = true;
    this.avoid = opts.avoid || null;
    this.resize();
    for (var i = 0; i < this.count; i++) this.spices.push(this.make(null));
    var self = this;
    if ('ResizeObserver' in window) new ResizeObserver(function () { self.resize(); }).observe(host);
    if (reduce) { this.draw(0); return; }
    host.addEventListener('pointermove', function (e) {
      if (e.target.closest('a, button, input, select, textarea, .stage')) { self.mx = self.my = -999; return; }
      var r = self.c.getBoundingClientRect();
      self.mx = e.clientX - r.left; self.my = e.clientY - r.top; self.lastMove = performance.now();
    }, { passive: true });
    host.addEventListener('pointerleave', function () { self.mx = self.my = -999; });
    host.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button, input, select, textarea, label, .stage, .hero__copy')) return;
      var r = self.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, hit = false;
      self.spices.forEach(function (s) { if (s.alive && self.hits(s, x, y, 16)) { self.pound(s, true); hit = true; } });
      if (!hit) self.drop(x, y);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; if (self.visible) self.start(); }).observe(host);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) self.start(); });
    this.start();
  }
  Field.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = this.host.clientWidth, h = this.host.clientHeight;
    this.w = w; this.h = h; this.dpr = dpr;
    this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
    this.c.style.width = w + 'px'; this.c.style.height = h + 'px';
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce && this.spices && this.spices.length) this.draw(0);
  };
  /* spices keep clear of the headline column on wide screens (opts.avoid = fraction of width) */
  Field.prototype.spawnX = function () {
    if (this.avoid && this.w > 900 && Math.random() < 0.8) return this.w * (this.avoid + Math.random() * (1 - this.avoid));
    return Math.random() * this.w;
  };
  Field.prototype.make = function (y) {
    var sp = this.sprites[(Math.random() * this.sprites.length) | 0], k = KINDS[sp.kind];
    var big = (k.size[0] + Math.pow(Math.random(), 1.3) * (k.size[1] - k.size[0])) * (this.w < 700 ? 0.7 : 1);
    var f = big / Math.max(sp.c.width, sp.c.height);
    return {
      sp: sp, w: sp.c.width * f, h: sp.c.height * f,
      x: this.spawnX(), y: y == null ? Math.random() * this.h : y,
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.016,
      vy: 0.34 + Math.random() * 0.6, ph: Math.random() * 6.28, amp: 8 + Math.random() * 18,
      alive: true, born: y == null ? 0 : 1
    };
  };
  Field.prototype.hits = function (s, x, y, pad) {
    var dx = x - s.cx, dy = y - s.y, c = Math.cos(s.rot), n = Math.sin(s.rot);
    var along = dx * c + dy * n, across = -dx * n + dy * c;
    return Math.abs(along) < s.w / 2 + pad && Math.abs(across) < s.h / 2 + pad;
  };
  Field.prototype.drop = function (x, y) {
    var s = this.make(y);
    s.x = x; s.cx = x; s.vy = 1.4; s.born = 1;
    this.spices.push(s);
    if (this.spices.length > this.count + 10) this.spices.splice(0, 1);
    if (P.fx && P.fx.pop) P.fx.pop(0.6 + Math.random() * 0.3);
  };
  Field.prototype.pound = function (s, loud) {
    s.alive = false;
    var self = this, k = KINDS[s.sp.kind], i;
    this.squash.push({ sp: s.sp, x: s.cx, y: s.y, rot: s.rot, w: s.w, h: s.h, t: 0 });
    this.pestles.push({ x: s.cx, y: s.y, t: 0, tilt: (Math.random() - 0.5) * 0.5 });
    for (i = 0; i < 16; i++) {
      var a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4.4;
      this.crumbs.push({ x: s.cx, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2.2, r: 1.5 + Math.random() * 3.8,
        c: k.crumbs[i % k.crumbs.length], rot: Math.random() * 6, life: 1, delay: 5 });
    }
    for (i = 0; i < 6; i++) this.puffs.push({ x: s.cx + (Math.random() - 0.5) * 30, y: s.y + 4, r: 6, life: 1, delay: 5 });
    if (Math.random() < 0.75) this.words.push({ x: s.cx, y: s.y - 24, t: k.words[(Math.random() * k.words.length) | 0], rot: (Math.random() - 0.5) * 0.4, life: 1, col: Math.random() < 0.5 ? '#FFB51F' : '#E3262E' });
    setTimeout(function () { if (P.fx && P.fx.thud) P.fx.thud(loud ? 1 : 0.6); }, 70);
    setTimeout(function () {
      var j = self.spices.indexOf(s);
      if (j > -1) self.spices[j] = self.make(-100);
    }, 900 + Math.random() * 1600);
  };
  Field.prototype.start = function () {
    if (this.running || reduce || !this.visible || document.hidden) return;
    this.running = true;
    var self = this;
    var tick = function (t) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      self.frame(t / 1000);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  Field.prototype.drawSprite = function (sp, x, y, rot, w, h, alpha, sx, sy) {
    var g = this.g;
    g.save();
    g.globalAlpha = alpha;
    g.translate(x, y);
    if (sx) g.scale(sx, sy);
    g.rotate(rot);
    g.drawImage(sp.c, -w / 2, -h / 2, w, h);
    g.restore();
  };
  /* the alu: a stone pestle, wider at the striking end */
  Field.prototype.drawPestle = function (x, y, tilt, alpha) {
    var g = this.g;
    g.save();
    g.globalAlpha = alpha;
    g.translate(x, y);
    g.rotate(tilt);
    g.beginPath();
    g.moveTo(-9, -76);
    g.quadraticCurveTo(0, -84, 9, -76);
    g.lineTo(15, -12);
    g.quadraticCurveTo(15, 2, 0, 2);
    g.quadraticCurveTo(-15, 2, -15, -12);
    g.closePath();
    g.fillStyle = '#9C978E';
    g.fill();
    g.lineWidth = 3; g.strokeStyle = INK; g.lineJoin = 'round';
    g.stroke();
    g.beginPath();
    g.moveTo(-5, -70); g.lineTo(-8, -16);
    g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineCap = 'round';
    g.stroke();
    g.restore();
  };
  Field.prototype.draw = function (t) {
    var g = this.g;
    g.clearRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.spices.length; i++) {
      var s = this.spices[i];
      if (!s.alive) continue;
      s.cx = s.x + Math.sin(t * 0.7 + s.ph) * s.amp;
      var sc = 1 - (s.born || 0);
      this.drawSprite(s.sp, s.cx, s.y, s.rot, s.w * sc, s.h * sc, 1);
    }
  };
  Field.prototype.frame = function (t) {
    var g = this.g, i;
    var hover = fine && this.mx > -900 && performance.now() - this.lastMove < 120;
    for (i = 0; i < this.spices.length; i++) {
      var s = this.spices[i];
      if (!s.alive) continue;
      s.y += s.vy;
      s.rot += s.vr;
      if (s.born > 0) s.born = Math.max(0, s.born - 0.05);
      if (s.y > this.h + Math.max(s.w, s.h)) { this.spices[i] = this.make(-Math.max(s.w, s.h)); continue; }
      s.cx = s.x + Math.sin(t * 0.7 + s.ph) * s.amp;
      if (hover && this.hits(s, this.mx, this.my, 2)) this.pound(s, false);
    }
    g.clearRect(0, 0, this.w, this.h);
    for (i = 0; i < this.spices.length; i++) {
      var k = this.spices[i];
      if (!k.alive) continue;
      var sc = 1 - k.born;
      this.drawSprite(k.sp, k.cx, k.y, k.rot, k.w * sc, k.h * sc, 1);
    }
    /* the spice flattens as the pestle lands, then is gone */
    for (i = this.squash.length - 1; i >= 0; i--) {
      var q = this.squash[i];
      q.t += 1 / 16;
      if (q.t >= 1) { this.squash.splice(i, 1); continue; }
      var e = q.t < 0.3 ? 0 : Math.min(1, (q.t - 0.3) / 0.25);
      this.drawSprite(q.sp, q.x, q.y + e * q.h * 0.25, q.rot, q.w, q.h, 1 - Math.max(0, (q.t - 0.55) / 0.45), 1 + e * 0.55, 1 - e * 0.72);
    }
    for (i = this.puffs.length - 1; i >= 0; i--) {
      var f = this.puffs[i];
      if (f.delay > 0) { f.delay--; continue; }
      f.life -= 0.04;
      if (f.life <= 0) { this.puffs.splice(i, 1); continue; }
      f.r += 1.1; f.y -= 0.3;
      g.save();
      g.globalAlpha = f.life * 0.75;
      g.fillStyle = '#FFFDF4';
      g.beginPath(); g.arc(f.x, f.y, f.r, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    for (i = this.crumbs.length - 1; i >= 0; i--) {
      var c = this.crumbs[i];
      if (c.delay > 0) { c.delay--; continue; }
      c.life -= 0.022;
      if (c.life <= 0) { this.crumbs.splice(i, 1); continue; }
      c.x += c.vx; c.y += c.vy; c.vy += 0.16; c.vx *= 0.99; c.rot += 0.1;
      g.save();
      g.globalAlpha = Math.min(1, c.life * 1.4);
      g.translate(c.x, c.y); g.rotate(c.rot);
      g.fillStyle = c.c;
      g.beginPath();
      g.moveTo(-c.r, -c.r * 0.6); g.lineTo(c.r * 0.8, -c.r); g.lineTo(c.r, c.r * 0.7); g.lineTo(-c.r * 0.7, c.r);
      g.closePath(); g.fill();
      g.lineWidth = 1; g.strokeStyle = 'rgba(30,20,16,.35)'; g.stroke();
      g.restore();
    }
    for (i = this.pestles.length - 1; i >= 0; i--) {
      var p = this.pestles[i];
      p.t += 1 / 28;
      if (p.t >= 1) { this.pestles.splice(i, 1); continue; }
      var y = p.t < 0.2 ? -90 + 86 * Math.pow(p.t / 0.2, 2) : p.t < 0.5 ? -4 : -4 - 60 * Math.pow((p.t - 0.5) / 0.5, 1.4);
      var al = p.t < 0.08 ? p.t / 0.08 : p.t > 0.6 ? 1 - (p.t - 0.6) / 0.4 : 1;
      this.drawPestle(p.x, p.y + y, p.tilt, al);
    }
    for (i = this.words.length - 1; i >= 0; i--) {
      var w = this.words[i];
      w.life -= 0.015;
      if (w.life <= 0) { this.words.splice(i, 1); continue; }
      w.y -= 0.8;
      var grow = Math.min(1, (1 - w.life) * 6);
      g.save();
      g.globalAlpha = Math.min(1, w.life * 1.8);
      g.translate(w.x, w.y); g.rotate(w.rot); g.scale(0.6 + grow * 0.4, 0.6 + grow * 0.4);
      g.font = '400 30px Ultra, Rockwell, Georgia, serif';
      g.textAlign = 'center';
      g.lineJoin = 'round';
      g.lineWidth = 9; g.strokeStyle = INK; g.strokeText(w.t, 0, 0);
      g.lineWidth = 5; g.strokeStyle = '#FFFFFF'; g.strokeText(w.t, 0, 0);
      g.fillStyle = w.col; g.fillText(w.t, 0, 0);
      g.restore();
    }
  };
  P.RempahField = Field;

  /* --------------------------------------------------------------- boot */
  var hosts = $$('canvas[data-rempah]');
  if (!hosts.length) return;
  var names = Object.keys(KINDS);
  Promise.all(names.map(function (n) { return loadImg('assets/img/spices/' + n + '.webp'); })).then(function (imgs) {
    var sprites = [];
    imgs.forEach(function (img, i) { if (img) sprites.push({ c: bake(img, 260), kind: names[i] }); });
    if (!sprites.length) return;
    /* chillies twice as often: it is rendang */
    var weighted = sprites.concat(sprites.filter(function (s) { return s.kind === 'chilli' || s.kind === 'anise'; }));
    hosts.forEach(function (cv) {
      var host = cv.closest('[data-rempah-host]') || cv.parentElement;
      var n = Number(cv.getAttribute('data-rempah')) || 18;
      if (innerWidth < 700) n = Math.round(n * 0.5);
      var avoid = Number(cv.getAttribute('data-avoid')) || 0;
      var start = function () { (P.rempahFields = P.rempahFields || []).push(new Field(cv, host, { count: n, sprites: weighted, avoid: avoid })); };
      if (P.fx && P.fx.ready) P.fx.ready.then(start); else start();
    });
  });
}());

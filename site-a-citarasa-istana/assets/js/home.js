/* Home page: hero entrance, nine-menu showcase, freezer-to-plate steps, counters, serving ideas, reviews, map, Raya list. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, $$, icon, money, esc, tr } = S;
  const motion = !S.reduced && window.gsap && window.ScrollTrigger;

  /* ---------- hero: the one orchestrated load moment ---------- */
  if (motion) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero-in', { opacity: 1, y: 0, duration: 1.2, stagger: 0.14 })
      .from('.hero__seal', { scale: 0, rotate: -90, duration: 1.1 }, 0.35)
      .from('.hero__pack', { y: 80, rotate: -22, opacity: 0, duration: 1.2 }, 0.45);
  } else {
    $$('.hero-in').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- nine-menu showcase ---------- */
  const F = P.products, n = F.length;
  const sec = $('#flavours'), stage = $('.flavours__stage', sec);
  const texts = $('.flavours__texts', sec), visual = $('.flavours__visual', sec), index = $('.flavours__index', sec);
  const facts = (f) => S.facts(f);
  const nameFor = (f) => f.name.replace('Pak Nil', '').trim();

  texts.innerHTML = F.map((f, i) => `
    <article class="fl-text" data-i="${i}" style="--c:${f.color.flood};--ci:${f.color.ink}" aria-hidden="true">
      ${f.badge ? `<span class="fl-text__badge" data-en="${esc(f.badge)}" data-ms="${esc(f.badgeBm || f.badge)}">${esc(f.badge)}</span>` : ''}
      <h3 class="fl-text__name"><a href="product.html?p=${f.id}">${esc(nameFor(f))}</a></h3>
      <p class="fl-text__alt"><span>${esc(f.en)}</span></p>
      <p class="fl-text__line" data-en="${esc(f.line)}" data-ms="${esc(f.lineBm)}">${esc(S.line(f))}</p>
      ${facts(f)}
      <div class="fl-buy">
        <span class="fl-price">${money(f.from)}${f.sizes.length > 1 ? `<small>/ ${P.C.sizeLabel(f.sizes[0].g)}</small>` : `<small>/ ${P.C.sizeLabel(f.sizes[0].g)}</small>`}</span>
        <button class="btn btn--flood" type="button" data-add="${f.id}-${f.sizes[0].g}" data-src-img="#fl-pack-${i} img"><span data-i18n="fl.add">${tr('fl.add')}</span>${icon('i-bag')}</button>
        <a class="link-arrow" href="product.html?p=${f.id}"><span data-en="See the menu" data-ms="Lihat menu">See the menu</span>${icon('i-arrow')}</a>
      </div>
    </article>`).join('');
  visual.innerHTML = `<svg class="fl-ring" viewBox="-50 -50 100 100" aria-hidden="true"><use href="#arch-line"/></svg>` +
    F.map((f, i) => `<div class="fl-window window" data-i="${i}"><video muted loop playsinline preload="none" poster="${f.clipPoster}" data-src="${f.clip}"></video></div>`).join('') +
    F.map((f, i) => `<div class="fl-pack" id="fl-pack-${i}" data-i="${i}"><img src="${f.pack}" alt="${esc(f.name)} pack" loading="${i ? 'lazy' : 'eager'}" width="740" height="1100"></div>`).join('');
  index.innerHTML = F.map((f, i) => `<button type="button" data-go="${i}" aria-current="false"><i style="--c:${f.color.flood}"></i>${esc(f.short)}</button>`).join('');
  S.applyLang(texts);

  let cur = -1, inView = false;
  const vids = $$('.fl-window video', visual);
  function playActive() {
    vids.forEach((v, j) => {
      if (j === cur && inView && !S.reduced) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else v.pause();
    });
  }
  function setActive(i) {
    if (i === cur) return;
    cur = i;
    const f = F[i];
    stage.style.setProperty('--flood', f.color.flood);
    stage.style.setProperty('--fink', f.color.ink);
    $$('.fl-text', texts).forEach((el, j) => { const on = j === i; el.classList.toggle('is-active', on); el.setAttribute('aria-hidden', String(!on)); el.inert = !on; });
    $$('.fl-pack, .fl-window', visual).forEach((el) => el.classList.toggle('is-active', Number(el.dataset.i) === i));
    $$('button', index).forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
    $('.cur', sec).textContent = String(i + 1).padStart(2, '0');
    const btn = index.children[i];
    if (btn) index.scrollTo({ left: btn.offsetLeft - index.clientWidth / 2 + btn.clientWidth / 2, behavior: 'smooth' });
    playActive();
  }
  setActive(0);
  new IntersectionObserver((es) => { inView = es.some((e) => e.isIntersecting); playActive(); }, { threshold: 0.3 }).observe(stage);

  let st = null;
  if (motion) {
    st = ScrollTrigger.create({
      trigger: stage, pin: true, start: () => 'top ' + $('.site-header').offsetHeight,
      end: () => '+=' + (n - 1) * window.innerHeight * 0.7,
      snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power2.inOut' },
      onUpdate: (self) => {
        setActive(Math.round(self.progress * (n - 1)));
        visual.style.setProperty('--rot', (self.progress * 120).toFixed(1) + 'deg');
      }
    });
  } else {
    sec.classList.add('flavours--static');
    $$('.fl-text', texts).forEach((el) => { el.classList.add('is-active'); el.setAttribute('aria-hidden', 'false'); el.inert = false; });
  }
  index.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    const i = Number(b.dataset.go);
    if (st) {
      const y = st.start + (st.end - st.start) * (i / (n - 1)) + 2;
      if (S.lenis) S.lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y });
    } else setActive(i);
  });

  /* ---------- freezer-to-plate steps (a real sequence, so numbered) ---------- */
  $('#steps-list').innerHTML = P.D.steps.map((s, i) => `
    <li class="step">
      <div class="step__media"><div class="window"><img src="assets/${s.img}" alt="${esc(s.alt)}" loading="lazy" width="576" height="1024"></div>
        ${S.arch(String(i + 1))}</div>
      <div><h3 class="h3" data-en="${esc(s.title)}" data-ms="${esc(s.bm)}">${esc(s.title)}</h3><span class="bm">${esc(s.bm)}</span>
      <p data-en="${esc(s.text)}" data-ms="${esc(s.textBm)}">${esc(s.text)}</p></div>
    </li>`).join('');
  S.applyLang($('#steps-list'));

  /* ---------- counters ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target, end = Number(el.dataset.count), suf = el.dataset.suffix || '';
    if (S.reduced) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1300;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => io.observe(el));

  /* ---------- serving ideas ---------- */
  $('#home-serve').innerHTML = ['pagi-raya', 'lunchbox', 'campfire'].map((id) => {
    const r = P.serve.find((x) => x.id === id), f = P.byId[r.products[0]];
    return `<a class="serve-card" href="serve.html#${r.id}">
      <div class="serve-card__img"><img src="${r.img}" alt="${esc(r.title)}" loading="lazy" width="720" height="1280">${r.video ? `<span class="play">${icon('i-play')}</span>` : ''}</div>
      <h3 data-en="${esc(r.title)}" data-ms="${esc(r.bm)}">${esc(r.title)}</h3>
      <div class="serve-meta"><span>${icon('i-users')}${esc(r.serves)}</span><span>${icon('i-clock')}${r.mins} min</span><span>${icon('i-bowl')}${esc(f.short)}</span></div>
    </a>`;
  }).join('');
  S.applyLang($('#home-serve'));

  /* ---------- reviews (real testimonials from rendangpaknil.com) ---------- */
  const stars = `<span class="stars" aria-label="5 out of 5">${icon('i-star').repeat(5)}</span>`;
  const rv = P.reviews.map((r) => `<figure class="review">${stars}<q lang="ms">${esc(r.bm)}</q><p class="en">${esc(r.en)}</p><cite>${esc(r.name)} · ${esc(P.byId[r.product].short)}</cite></figure>`);
  const ph = (src, alt) => `<div class="review-photo"><img src="assets/${src}" alt="${alt}" loading="lazy"></div>`;
  $('#home-reviews').innerHTML = [rv[2], ph('img/photos/minang-spices-ig.webp', 'Rendang Minang Pak Nil pack among shallots, garlic, chillies and spices'), rv[0], rv[3], ph('img/photos/mihas-totes.webp', 'Two visitors with “i RENDANG you very much” tote bags at MIHAS 2026'), rv[1], rv[4], ph('img/stills/kuah-kacang-bowl.webp', 'A bowl of kuah kacang with peanuts, lime and lemongrass')].join('');

  /* ---------- where to buy ---------- */
  const K = P.D.brand.geo, M = P.D.mihas.geo;
  const W = {
    kitchen: [
      { t: 'Rumpun Selera kitchen', s: 'No 2 Jalan 2/12, Bandar Baru Selayang, 68100 Batu Caves', ll: K, z: 16 },
      { t: 'Asam Pedas London', s: 'Rumpun Selera’s restaurant brand. Customers buy packs while dining.', ll: K, z: 14 }
    ],
    online: [
      { t: 'rendangpaknil.com', s: 'All nine menus, frozen delivery', ll: [3.15, 101.66], z: 10 },
      { t: 'WhatsApp orders', s: '+60 11-6982 5208 (also +60 11-6097 5809)', ll: K, z: 12 }
    ],
    events: [
      { t: 'MIHAS 2026, MITEC', s: 'Booth 10B04 & 10B05, Exhibition Hall Level 3, 23–26 September 2026', ll: M, z: 15 },
      { t: 'Next event', s: 'Follow @rendangpaknil for the next bazaar or expo', ll: [3.2, 101.66], z: 11 }
    ]
  };
  let map = null;
  const list = $('#where-list');
  function renderWhere(key) {
    $$('[data-where]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.where === key)));
    list.innerHTML = W[key].map((p, i) => `<li tabindex="0" data-i="${i}" data-k="${key}">${icon(key === 'online' ? 'i-bag' : key === 'events' ? 'i-calendar' : 'i-pin')}<div><b>${esc(p.t)}</b><span>${esc(p.s)}</span></div></li>`).join('');
  }
  function fly(key, i) {
    const p = W[key][i];
    $$('li', list).forEach((li) => li.classList.toggle('is-on', Number(li.dataset.i) === i));
    if (map) map.flyTo(p.ll, p.z, { duration: S.reduced ? 0 : 1.2 });
  }
  $$('[data-where]').forEach((b) => b.addEventListener('click', () => { renderWhere(b.dataset.where); fly(b.dataset.where, 0); }));
  list.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) fly(li.dataset.k, Number(li.dataset.i)); });
  list.addEventListener('keydown', (e) => { const li = e.target.closest('li'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fly(li.dataset.k, Number(li.dataset.i)); } });
  renderWhere('kitchen');

  function initMap() {
    if (map || !window.L) return;
    map = L.map('map', { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(K, 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18
    }).addTo(map);
    const mk = (hq) => L.divIcon({ className: 'map-pin' + (hq ? ' hq' : ''), html: '<svg aria-hidden="true"><use href="#arch"/></svg>', iconSize: hq ? [42, 42] : [32, 32] });
    L.marker(K, { icon: mk(true), title: 'Rumpun Selera kitchen' }).addTo(map).bindPopup('<b>Rumpun Selera kitchen</b><br>Bandar Baru Selayang, Batu Caves');
    L.marker(M, { icon: mk(false), title: 'MIHAS 2026 at MITEC' }).addTo(map).bindPopup('<b>MIHAS 2026</b><br>MITEC, booth 10B04 &amp; 10B05');
    L.circle([3.14, 101.66], { radius: 24000, color: '#C8102E', weight: 1.5, fillColor: '#C8102E', fillOpacity: 0.08 }).addTo(map).bindPopup('<b>Frozen delivery zone</b><br>Klang Valley (proposed)');
    map.setView([3.2, 101.66], 11);
  }
  const mio = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { initMap(); mio.disconnect(); } }, { rootMargin: '400px' });
  mio.observe($('#map'));

  /* ---------- Raya list ---------- */
  $('#club-form').addEventListener('submit', (e) => { e.preventDefault(); e.target.reset(); S.toast(tr('club.done')); });

  document.addEventListener('pn:lang', () => S.applyLang());
  window.addEventListener('load', () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();

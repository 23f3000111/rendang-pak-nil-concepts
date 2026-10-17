/* Serving ideas (cara hidang): filters, search, an idea pop-up with the brand's own reel, and serve mode. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, $$, icon, money, esc } = S;
  const R = P.serve;
  let cat = 'all', withVideo = false, q = '';

  function card(r) {
    const f = P.byId[r.products[0]];
    return `<button type="button" class="serve-card" id="${r.id}" data-open="${r.id}">
      <div class="serve-card__img"><img src="${r.img}" alt="" loading="lazy" width="720" height="1280">${r.video ? `<span class="play">${icon('i-play')}</span>` : ''}</div>
      <h3 data-en="${esc(r.title)}" data-ms="${esc(r.bm)}">${esc(r.title)}</h3>
      <div class="serve-meta"><span>${icon('i-users')}${esc(r.serves)}</span><span>${icon('i-clock')}${r.mins} min</span><span>${icon('i-bowl')}${esc(f.short)}</span></div>
    </button>`;
  }
  function render() {
    const list = R.filter((r) => (cat === 'all' || r.cat === cat) && (!withVideo || r.video) &&
      (!q || P.C.normalize(r.title + ' ' + r.bm + ' ' + r.note + ' ' + r.need.join(' ') + ' ' + r.products.map((id) => P.byId[id].name).join(' ')).includes(P.C.normalize(q))));
    $('#r-grid').innerHTML = list.map(card).join('');
    $('#r-empty').hidden = list.length > 0;
    S.applyLang($('#r-grid'));
  }
  $$('[data-cat]').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat; $$('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); render(); }));
  $('[data-video]').addEventListener('click', (e) => { withVideo = !withVideo; e.currentTarget.setAttribute('aria-pressed', String(withVideo)); render(); });
  $('#r-search').addEventListener('input', (e) => { q = e.target.value.trim(); render(); });
  render();

  /* ---------- idea pop-up ---------- */
  function open(id) {
    const r = R.find((x) => x.id === id);
    if (!r) return;
    const prods = r.products.map((pid) => P.byId[pid]);
    const pairs = prods.map((f) => `<div class="pair" data-card><img src="${f.sm}" alt=""><div><b>${esc(f.name)}</b><br><span class="small muted">${money(f.sizes[0].price)} · ${P.C.sizeLabel(f.sizes[0].g)}</span></div>
        <button class="btn btn--sm" type="button" data-add="${f.id}-${f.sizes[0].g}" style="margin-left:auto">${icon('i-bag')}Add</button></div>`).join('');
    const media = r.video
      ? `<div class="reel-frame" id="rv"><img src="${r.video.replace(/\.mp4$/, '.jpg')}" alt=""><button class="play" type="button" aria-label="Play the video">${icon('i-play')}</button></div>`
      : `<div class="reel-frame"><img src="${r.img}" alt="${esc(r.title)}"></div>`;
    const m = S.modal(`
      <div class="serve-modal">
        <div class="stack" style="--gap:14px">${media}</div>
        <div class="stack" style="--gap:18px">
          <p class="accent accent--md" style="margin:0">${esc(r.bm)}</p>
          <h2 class="h2" style="font-size:clamp(32px,3.6vw,50px)">${esc(r.title)}</h2>
          <p class="muted" style="margin:0">${esc(r.note)}</p>
          <div class="serve-meta" style="padding:0"><span>${icon('i-users')}Serves ${esc(r.serves)}</span><span>${icon('i-clock')}${r.mins} min</span></div>
          <div class="stack" style="--gap:10px">${pairs}</div>
          <ul class="need-list">${r.need.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
          <ol class="num-list">${r.steps.map((s) => `<li><span>${esc(s)}</span></li>`).join('')}</ol>
          <button class="btn btn--dark" type="button" id="cook">${icon('i-flame')}Start serve mode</button>
        </div>
      </div>`, 980);
    const rv = $('#rv', m);
    if (rv) rv.querySelector('.play').addEventListener('click', () => { rv.innerHTML = `<video src="${r.video}" controls autoplay playsinline></video>`; });
    $('#cook', m).addEventListener('click', () => serveMode(r));
    history.replaceState(null, '', '#' + r.id);
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) { e.preventDefault(); open(b.dataset.open); } });
  if (location.hash) {
    const h = location.hash.slice(1);
    if (h === 'raya') setTimeout(() => $('#raya').click(), 200);
    else setTimeout(() => open(h), 400);
  }

  /* ---------- serve mode: one big step at a time ---------- */
  async function serveMode(r) {
    S.closeLayer();
    let i = 0, lock = null;
    try { if ('wakeLock' in navigator) lock = await navigator.wakeLock.request('screen'); } catch (e) { /* not supported */ }
    const el = document.createElement('div');
    el.className = 'cook'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Serve mode');
    document.body.appendChild(el);
    if (S.lenis) S.lenis.stop();
    const paint = () => {
      el.innerHTML = `<div class="cook__top"><span class="accent" style="color:var(--emas);font-size:28px">${esc(r.title)}</span>
          <span class="small" style="display:inline-flex;gap:6px;align-items:center;opacity:.8">${icon('i-sparkle')}${lock ? 'Screen stays on' : 'Keep your screen awake'}</span>
          <button class="icon-btn" type="button" data-x aria-label="Exit serve mode">${icon('i-close')}</button></div>
        <div class="cook__step"><small>Step ${i + 1} of ${r.steps.length}</small><p>${esc(r.steps[i])}</p></div>
        <div><div class="cook__bar"><i style="--p:${((i + 1) / r.steps.length) * 100}%"></i></div>
          <div class="cook__nav"><button class="btn btn--light" type="button" data-p ${i ? '' : 'disabled'}>${icon('i-arrow-left')}Back</button>
          <button class="btn" type="button" data-n>${i === r.steps.length - 1 ? 'Done, selamat makan' : 'Next step'}${icon('i-arrow')}</button></div></div>`;
      el.querySelector('[data-n]').focus();
    };
    const close = () => { el.remove(); if (S.lenis) S.lenis.start(); if (lock) lock.release(); document.removeEventListener('keydown', key); };
    const key = (e) => { if (e.key === 'ArrowRight') nav(1); if (e.key === 'ArrowLeft') nav(-1); if (e.key === 'Escape') close(); };
    const nav = (d) => { if (d > 0 && i === r.steps.length - 1) { close(); S.toast('Selamat makan!'); return; } i = Math.max(0, Math.min(r.steps.length - 1, i + d)); paint(); };
    el.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) close(); if (e.target.closest('[data-n]')) nav(1); if (e.target.closest('[data-p]')) nav(-1); });
    document.addEventListener('keydown', key);
    paint();
  }
})();

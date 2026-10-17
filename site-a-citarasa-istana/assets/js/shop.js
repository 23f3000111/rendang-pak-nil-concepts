/* Shop: filterable grid with size choice, Raya set builder, kenduri and gift boxes, freezer stock-up. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, $$, icon, money, esc } = S;
  const F = P.products;
  const sizeOf = {}; /* product id -> chosen size in grams */
  F.forEach((f) => { sizeOf[f.id] = f.sizes[0].g; });
  const priceOf = (f, g) => f.sizes.find((z) => z.g === g).price;

  /* ---------- grid ---------- */
  const grid = $('#grid');
  let filter = 'all', sort = 'featured';
  function card(f) {
    const g = sizeOf[f.id];
    const pills = f.sizes.length > 1
      ? `<div class="size-pills" role="group" aria-label="Pack size">${f.sizes.map((z) => `<button type="button" data-size="${z.g}" aria-pressed="${z.g === g}">${P.C.sizeLabel(z.g)}</button>`).join('')}</div>`
      : `<div class="size-pills"><button type="button" aria-pressed="true" tabindex="-1">${P.C.sizeLabel(g)}</button></div>`;
    return `<article class="p-card" data-card data-id="${f.id}" style="--c:${f.color.flood}">
      ${f.badge ? `<span class="tag tag--gold p-card__badge" data-en="${esc(f.badge)}" data-ms="${esc(f.badgeBm || f.badge)}">${esc(f.badge)}</span>` : ''}
      <a class="p-card__img" href="product.html?p=${f.id}&amp;s=${g}" aria-label="${esc(f.name)}"><img class="packimg" src="${f.pack}" alt="" loading="lazy" width="740" height="1100"><img class="dish" src="${f.dish}" alt="" loading="lazy"></a>
      <h3><a href="product.html?p=${f.id}&amp;s=${g}">${esc(f.name.replace(' Pak Nil', ''))}</a></h3>
      <p class="alt">${esc(f.en)}</p>
      ${pills}
      <div class="p-card__row"><span class="p-card__price">${money(priceOf(f, g))}</span>
        <button class="add-round" type="button" data-add="${f.id}-${g}" aria-label="Add ${esc(f.name)} ${P.C.sizeLabel(g)} to cart">${icon('i-plus')}</button></div>
    </article>`;
  }
  function renderGrid() {
    const skus = P.C.filterSkus(P.C.skus(P.D), P.D, filter).filter((s) => s.kind === 'pack');
    const ids = [...new Set(skus.map((s) => s.product))];
    if (filter === '1000') ids.forEach((id) => { sizeOf[id] = 1000; });
    let list = F.filter((f) => ids.includes(f.id));
    if (sort !== 'featured') list = [...list].sort((a, b) => (priceOf(a, sizeOf[a.id]) - priceOf(b, sizeOf[b.id])) * (sort === 'price-asc' ? 1 : -1));
    grid.innerHTML = list.map(card).join('');
    S.applyLang(grid);
  }
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-size]');
    if (!b) return;
    const id = b.closest('[data-card]').dataset.id;
    sizeOf[id] = Number(b.dataset.size);
    const cardEl = b.closest('[data-card]');
    cardEl.outerHTML = card(P.byId[id]);
    S.applyLang(grid);
  });
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderGrid();
  }));
  $('#sort').addEventListener('change', (e) => { sort = e.target.value; renderGrid(); });
  renderGrid();

  /* ---------- Raya set builder: any three packs, 5% off (proposed) ---------- */
  const NEED = 3, PCT = 5;
  const picks = [];
  $('#pick').innerHTML = F.map((f) => `<div class="pick" data-id="${f.id}" style="--c:${f.color.flood}">
      <div class="pick__img"><img src="${f.sm}" alt="" loading="lazy" width="380" height="560"></div><b>${esc(f.short)}</b>
      <span class="small muted">${P.C.sizeLabel(f.sizes[0].g)} · ${money(f.sizes[0].price)}</span>
      <div class="qty"><button type="button" data-b="-1" aria-label="One less ${esc(f.short)}">${icon('i-minus')}</button><output>0</output><button type="button" data-b="1" aria-label="One more ${esc(f.short)}">${icon('i-plus')}</button></div>
    </div>`).join('');
  function renderSet() {
    const c = picks.length;
    $('#b-count').textContent = c >= NEED ? 'All three picked' : `${c} of ${NEED} picked`;
    $('#slots').innerHTML = Array.from({ length: NEED }, (_, i) => {
      const f = picks[i] && P.byId[picks[i]];
      return `<span>${f ? `<img src="${f.sm}" alt="${esc(f.short)}">` : ''}</span>`;
    }).join('');
    $$('.pick').forEach((p) => { p.querySelector('output').textContent = picks.filter((x) => x === p.dataset.id).length; });
    const prices = picks.map((id) => P.byId[id].sizes[0].price);
    const t = P.C.bundleTotal(prices, NEED, PCT);
    $('#b-price').textContent = money(t.price);
    $('#b-was').textContent = t.done ? money(t.full) : '';
    $('#b-save').textContent = t.done ? 'You save ' + money(t.saved) : 'Pick three to unlock 5% off';
    $('#b-add').disabled = !t.done;
  }
  $('#pick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-b]');
    if (!b) return;
    const id = b.closest('.pick').dataset.id, d = Number(b.dataset.b);
    if (d > 0) {
      if (picks.length >= NEED) { S.toast('Your set already has three packs.'); return; }
      picks.push(id);
    } else {
      const at = picks.lastIndexOf(id);
      if (at > -1) picks.splice(at, 1);
    }
    renderSet();
  });
  $('#b-fill').addEventListener('click', () => {
    picks.length = 0;
    picks.push('minang', 'kacang', 'sambal');
    renderSet();
  });
  $('#b-add').addEventListener('click', () => {
    const t = P.C.bundleTotal(picks.map((id) => P.byId[id].sizes[0].price), NEED, PCT);
    const note = picks.map((id) => `${P.byId[id].short} ${P.C.sizeLabel(P.byId[id].sizes[0].g)}`).join(', ');
    S.addToCart('set-3', 1, $('#slots img'), { key: 'set-3:' + picks.join(',') + ':' + Date.now(), note, price: t.price });
    picks.length = 0;
    renderSet();
  });
  renderSet();

  /* ---------- kenduri and gift boxes (priced on WhatsApp) ---------- */
  const wa = (text) => P.C.waLink(P.D.links.waNumber, text);
  const boxes = [
    { title: 'Raya open house box', bm: 'Kotak rumah terbuka Raya', body: 'Rendang Minang, Kuah Kacang and Kuah Sambal Serbaguna in 1 kg packs, for a full Raya table.', img: 'assets/img/photos/range-table.webp', bg: 'var(--istana)', fg: 'var(--kertas)' },
    { title: 'Kenduri box', bm: 'Kotak kenduri', body: 'Four 1 kg packs of your choice. Rendang Daging, Paru and Ayam are the usual trio for a kenduri.', img: 'assets/img/stills/spread-table.webp', bg: 'var(--cili)', fg: '#fff' },
    { title: 'Corporate gifts', bm: 'Hadiah korporat', body: 'Twenty boxes or more for staff and clients, with a card. Quoted on WhatsApp.', img: 'assets/img/photos/mihas-totes.webp', bg: 'var(--emas)', fg: 'var(--istana-2)' },
    { title: 'Catering trays', bm: 'Dulang katering', body: 'Rumpun Selera has catered since 2001. Ask for rendang by the tray for your event.', img: 'assets/img/stills/make-brass.webp', bg: 'var(--kertas-2)', fg: 'var(--istana)' }
  ];
  $('#box-cards').innerHTML = boxes.map((g) => `<article class="f-card" style="background:${g.bg};color:${g.fg};border-color:var(--istana)">
      <span class="tag" style="justify-self:start">Concept</span>
      <img src="${g.img}" alt="" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:999px 999px 14px 14px;margin-block:6px">
      <h3 style="color:inherit">${esc(g.title)}</h3><p style="color:inherit;opacity:.9">${esc(g.body)}</p>
      <div class="p-card__row" style="padding:0"><span class="small" style="font-weight:700">Price on WhatsApp</span>
      <a class="btn btn--sm btn--dark" href="${wa(`Assalamualaikum Rendang Pak Nil, saya berminat dengan ${g.bm}.`)}" target="_blank" rel="noopener">${icon('i-whatsapp')}Ask</a></div>
    </article>`).join('');

  /* ---------- freezer stock-up (proposal) ---------- */
  const base = ['minang-500', 'minang-500', 'daging-500', 'ayam-500'].reduce((s, id) => s + P.skus[id].price, 0);
  const subPrice = Math.round(base * 90) / 100;
  $('#sub-price').textContent = money(subPrice);
  $('#sub-btn').addEventListener('click', () => S.addToCart('stock-up', 1, $('#stock-up img'), { key: 'stock-up', note: '2× Minang, 1× Daging, 1× Ayam (500 g), monthly', price: subPrice }));
})();

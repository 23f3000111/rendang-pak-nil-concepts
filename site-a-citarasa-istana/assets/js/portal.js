/* Agent portal demo: sign in, reorder with live totals, sample agent tiers, marketing kit. All numbers are sample data. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, $$, icon, esc, money } = S;
  const TIERS = [{ name: 'Ejen Gangsa', from: 1, off: 0.1 }, { name: 'Ejen Perak', from: 20, off: 0.15 }, { name: 'Ejen Emas', from: 50, off: 0.2 }]; /* sample discounts off shop price */
  const last = { 'minang-500': 12, 'daging-500': 8, 'ayam-500': 6, 'kacang-1000': 4, 'sambal-1000': 4 };

  const signedIn = () => S.store.get('pn-a-agent', false);
  function view() {
    const on = signedIn();
    $('#login-view').hidden = on;
    $('#portal-view').hidden = !on;
  }
  $('#login-form').addEventListener('submit', (e) => { e.preventDefault(); S.store.set('pn-a-agent', true); view(); window.scrollTo(0, 0); S.toast('Signed in to the demo agent account.'); });
  $('#logout').addEventListener('click', (e) => { e.preventDefault(); S.store.set('pn-a-agent', false); view(); });

  const tierFor = (packs) => (packs >= 50 ? 2 : packs >= 20 ? 1 : 0);
  const agentPrice = (id, t) => Math.round(P.skus[id].price * (1 - TIERS[t].off) * 100) / 100;

  function renderReorder() {
    const total = Object.values(last).reduce((a, b) => a + b, 0);
    const t = tierFor(total);
    let sum = 0, retail = 0;
    $('#ro-table tbody').innerHTML = Object.entries(last).map(([id, n]) => {
      const s = P.skus[id], f = P.byId[s.product], ap = agentPrice(id, t);
      sum += ap * n; retail += s.price * n;
      return `<tr><td style="display:flex;gap:12px;align-items:center"><img src="${f.sm}" alt="" width="34" height="48" style="object-fit:contain">${esc(f.short)} <span class="small muted">${P.C.sizeLabel(s.size)}</span></td>
        <td><div class="qty"><button type="button" data-r="-1" data-id="${id}" aria-label="Fewer packs of ${esc(f.short)}">${icon('i-minus')}</button><output>${n}</output><button type="button" data-r="1" data-id="${id}" aria-label="More packs of ${esc(f.short)}">${icon('i-plus')}</button></div></td>
        <td>${money(ap)}</td><td><b>${money(ap * n)}</b></td></tr>`;
    }).join('');
    $('#ro-total').textContent = money(sum);
    $('#k-month').textContent = total;
    $('#k-next').textContent = t === 2 ? '0' : String(TIERS[t + 1].from - total);
    $('#k-next').nextElementSibling.textContent = t === 2 ? 'top tier reached' : `packs to ${TIERS[t + 1].name}`;
    $('#k-margin').textContent = money(retail - sum);
    $('#tier-name').textContent = `${TIERS[t].name}: ${t === 0 ? '1–19' : t === 1 ? '20–49' : '50+'} packs a month`;
    const go = $('#ro-go');
    go.textContent = '';
    go.insertAdjacentHTML('beforeend', `${icon('i-refresh')}Reorder ${total} packs`);
    renderTiers(t);
  }
  function renderTiers(active) {
    const ids = P.products.flatMap((f) => f.sizes.map((z) => `${f.id}-${z.g}`));
    $('#tier-table tbody').innerHTML = ids.map((id) => {
      const s = P.skus[id], f = P.byId[s.product];
      return `<tr><td>${esc(f.short)} <span class="small muted">${P.C.sizeLabel(s.size)}</span></td><td>${money(s.price)}</td>${TIERS.map((_, i) => `<td style="${i === active ? 'background:color-mix(in srgb,var(--emas) 28%,transparent);font-weight:800' : ''}">${money(agentPrice(id, i))}</td>`).join('')}</tr>`;
    }).join('');
  }
  $('#ro-table').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    last[b.dataset.id] = Math.max(0, last[b.dataset.id] + Number(b.dataset.r));
    renderReorder();
  });
  $('#ro-go').addEventListener('click', () => S.toast('Order AG-26-' + (1000 + Math.floor(Math.random() * 99)) + ' placed (demo). Frozen delivery on Thursday.'));
  document.addEventListener('click', (e) => { if (e.target.closest('[data-dl]')) S.toast('Demo: the live portal downloads the PDF.'); });
  $$('.portal__side a[href^="#"]:not(#logout)').forEach((a) => a.addEventListener('click', () => {
    $$('.portal__side a').forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'page');
  }));

  /* ---------- marketing kit: their own photos and reels ---------- */
  const kit = [
    { img: 'assets/img/photos/range-paknil.webp', label: 'All nine menus with Pak Nil (banner)' },
    { img: 'assets/img/photos/key-visual.webp', label: 'Rendang Minang key visual' },
    { img: 'assets/video/reel-menu.jpg', label: 'Reel: all nine on the table', reel: 'assets/video/reel-menu.mp4' },
    { img: 'assets/video/reel-heat.jpg', label: 'Reel: freezer to bowl', reel: 'assets/video/reel-heat.mp4' }
  ];
  $('#kit-grid').innerHTML = kit.map((k) => `<figure class="expo"><button type="button" style="padding:0;border:0;background:none;cursor:pointer" ${k.reel ? `data-reel="${k.reel}" data-reel-title="${esc(k.label)}"` : 'data-dl'}><img src="${k.img}" alt="${esc(k.label)}" loading="lazy" style="border-color:var(--line)"></button><figcaption style="color:var(--ink-soft)">${esc(k.label)}</figcaption></figure>`).join('');

  renderReorder();
  view();
})();

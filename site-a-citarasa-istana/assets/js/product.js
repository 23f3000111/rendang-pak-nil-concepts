/* Product page, driven by ?p=<product id>&s=<grams>. Falls back to Rendang Minang Pak Nil. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, $$, icon, money, esc } = S;
  const r = P.C.resolveProduct(location.search, P.D);
  const f = P.byId[r.product];
  let g = r.size;
  const price = () => f.sizes.find((z) => z.g === g).price;
  const serve = P.serve.find((x) => x.products.includes(f.id)) || P.serve[0];

  document.title = `${f.name} | Rendang Pak Nil (concept)`;
  const pdp = $('.pdp');
  pdp.style.setProperty('--c', f.color.flood);
  pdp.style.setProperty('--ci', f.color.ink);
  $('#crumb').textContent = f.short;
  $('#p-name').textContent = f.name;
  $('#p-en').textContent = f.en;
  if (f.badge) { const b = $('#p-badge'); b.hidden = false; b.dataset.en = f.badge; b.dataset.ms = f.badgeBm || f.badge; b.textContent = f.badge; }
  const mine = P.reviews.filter((v) => v.product === f.id);
  if (mine.length) {
    $('#p-rev').hidden = false;
    $('#p-stars').innerHTML = icon('i-star').repeat(5);
    $('#p-rev-n').textContent = `${mine.length} customer testimonial${mine.length > 1 ? 's' : ''}`;
  }
  const lineEl = $('#p-line');
  lineEl.dataset.en = f.line; lineEl.dataset.ms = f.lineBm; lineEl.textContent = S.line(f);
  $('#p-facts').innerHTML = S.facts(f);
  $('#p-notes').innerHTML = f.notes.map((n, i) => `<span class="tag${i === 0 ? ' tag--cili' : ''}" data-en="${esc(n)}" data-ms="${esc(f.notesBm[i])}">${esc(n)}</span>`).join('');
  if (f.group === 'kuah') $('#p-trade').textContent = 'Kuah comes in 1 kg packs, the size caterers and kenduri kitchens use. Agents get their own prices.';

  /* ---------- sizes + price ---------- */
  function renderSize() {
    $('#p-sizes').innerHTML = f.sizes.map((z) => `<button type="button" data-g="${z.g}" aria-pressed="${z.g === g}"><b>${P.C.sizeLabel(z.g)}</b><span>${money(z.price)}${z.g === 500 ? ' · serves 2–4' : ' · family size'}</span></button>`).join('');
    $('#p-price').textContent = money(price());
    $('#p-size-note').textContent = `${P.C.sizeLabel(g)} pack · frozen`;
    $('#sb-price').textContent = `${money(price())} · ${P.C.sizeLabel(g)}`;
    history.replaceState(null, '', `?p=${f.id}&s=${g}`);
  }
  $('#p-sizes').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (!b) return; g = Number(b.dataset.g); renderSize(); });
  renderSize();

  /* ---------- gallery: pack, dish, product clip, new Warisan pouch, lifestyle ---------- */
  const shots = [
    { src: f.pack, alt: `${f.name} pack`, pack: true },
    { src: f.dish, alt: `${f.short}, served`, cap: f.dish.includes('/stock/') ? 'Serving suggestion (stock photo)' : 'Serving suggestion' },
    { video: f.clip, src: f.clipPoster, alt: `${f.short} in Rendang Pak Nil’s product reel`, cap: 'From their product reel' },
    ...f.warisanImgs.map((w) => ({ src: w, alt: `The new Warisan × PakNil pouch, ${w.includes('480') ? '480 g' : '980 g'}`, pack: true, cap: `New Warisan × PakNil pouch, ${w.includes('480') ? '480 g' : '980 g'} (shown at MIHAS 2026)` })),
    ...(f.id === 'minang' ? [{ src: 'assets/img/photos/minang-studio.webp', alt: 'Rendang Minang Pak Nil pack in the studio' }, { src: 'assets/img/photos/key-visual.webp', alt: 'Rendang Minang Pak Nil key visual with Pak Nil', cap: 'Key visual' }] : []),
    ...(f.id === 'dendeng' ? [{ src: 'assets/img/photos/dendeng-spices.webp', alt: 'Rendang Dendeng Perak pack with spices' }] : [])
  ].slice(0, 6);
  const main = $('#g-main'), thumbs = $('#g-thumbs');
  function show(i) {
    const s = shots[i];
    $$('button', thumbs).forEach((b, j) => b.setAttribute('aria-current', String(i === j)));
    const cap = s.cap ? `<span class="gallery__cap">${esc(s.cap)}</span>` : '';
    if (s.video) main.innerHTML = `<video src="${s.video}" poster="${s.src}" autoplay muted loop playsinline aria-label="${esc(s.alt)}"></video>${cap}`;
    else main.innerHTML = `<img class="${s.pack ? 'is-pack' : ''}" src="${s.src}" alt="${esc(s.alt)}">${cap}`;
  }
  thumbs.innerHTML = shots.map((s) => `<button type="button" class="${s.video ? 'vid' : ''}" aria-label="${esc(s.alt)}"><img class="${s.pack ? 'is-pack' : ''}" src="${s.src}" alt="">${s.video ? icon('i-play') : ''}</button>`).join('');
  thumbs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show([...thumbs.children].indexOf(b)); });
  show(0);

  /* ---------- buy ---------- */
  let qty = 1;
  $$('[data-pq]').forEach((b) => b.addEventListener('click', () => { qty = Math.max(1, qty + Number(b.dataset.pq)); $('#p-qty').textContent = qty; }));
  $('#p-add').addEventListener('click', () => S.addToCart(`${f.id}-${g}`, qty, $('#g-main img') || $('#g-thumbs img')));
  $('#sb-img').src = f.sm;
  $('#sb-name').textContent = f.name;
  $('#sb-add').addEventListener('click', () => S.addToCart(`${f.id}-${g}`, 1, $('#sb-img')));
  const sticky = $('#sticky-buy');
  new IntersectionObserver(([en]) => {
    const on = !en.isIntersecting && en.boundingClientRect.top < 0;
    sticky.classList.toggle('show', on);
    sticky.setAttribute('aria-hidden', String(!on));
  }).observe($('#buy-row'));

  /* ---------- details ---------- */
  const steps = P.D.steps.map((s) => `<li>${esc(s.text)}</li>`).join('');
  const qs = P.D.faqs.filter((q) => ['prep', 'trust'].includes(q.cat)).slice(0, 4);
  $('#p-acc').innerHTML = `
    <details open><summary>How to heat it${icon('i-chevron')}</summary><div class="acc__body"><ol>${steps}</ol></div></details>
    <details><summary>Storage${icon('i-chevron')}</summary><div class="acc__body"><p>Keep it frozen (simpan sejukbeku) until you need it. The best-before date is printed on every pack. Thaw only what you plan to heat.</p></div></details>
    <details><summary>What’s inside${icon('i-chevron')}</summary><div class="acc__body"><p>${esc(f.line)}</p><p>The full ingredient list is printed on the pack. Made in Rumpun Selera’s kitchen, Bandar Baru Selayang.</p></div></details>
    <details><summary>Questions${icon('i-chevron')}</summary><div class="acc__body">${qs.map((q) => `<p><b>${esc(q.q)}</b><br>${esc(q.a)}</p>`).join('')}</div></details>`;

  /* ---------- serve it tonight ---------- */
  $('#serve-title').textContent = serve.title;
  $('#serve-link').href = 'serve.html#' + serve.id;
  const reel = $('#reel');
  const vsrc = serve.video || f.clip;
  reel.innerHTML = `<img src="${vsrc.replace(/\.mp4$/, '.jpg')}" alt="${esc(serve.title)}"><button class="play" type="button" aria-label="Play the ${esc(serve.title)} video">${icon('i-play')}</button>`;
  reel.querySelector('.play').addEventListener('click', () => {
    reel.innerHTML = `<video src="${vsrc}" controls autoplay playsinline></video>`;
  });
  $('#need').innerHTML = serve.need.map((n) => `<li>${esc(n)}</li>`).join('');
  $('#steps').innerHTML = serve.steps.map((s) => `<li><span>${esc(s)}</span></li>`).join('');

  /* ---------- testimonials ---------- */
  const stars = `<span class="stars" aria-label="5 out of 5">${icon('i-star').repeat(5)}</span>`;
  const list = (mine.length ? mine : P.reviews).slice(0, 6);
  $('#rev-list').innerHTML = list.map((v) => `<figure class="review">${stars}<q lang="ms">${esc(v.bm)}</q><p class="en">${esc(v.en)}</p><cite>${esc(v.name)}</cite></figure>`).join('');
  $('#write-rev').addEventListener('click', () => {
    const m = S.modal(`<h2 class="h3">Review ${esc(f.short)}</h2>
      <div class="star-input" role="radiogroup" aria-label="Your rating">${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}" data-s="${n}">${icon('i-star')}</button>`).join('')}</div>
      <div class="field" style="margin-top:14px"><label for="rv-text">Your review</label><textarea class="textarea" id="rv-text" placeholder="What did you serve it with?"></textarea></div>
      <button class="btn" type="button" style="width:100%;margin-top:16px" data-send>Post review</button>`, 520);
    let rating = 0;
    $$('[data-s]', m).forEach((b) => b.addEventListener('click', () => {
      rating = Number(b.dataset.s);
      $$('[data-s]', m).forEach((x) => { const on = Number(x.dataset.s) <= rating; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(Number(x.dataset.s) === rating)); });
    }));
    $('[data-send]', m).addEventListener('click', () => {
      if (!rating) { S.toast('Choose a star rating first.'); return; }
      S.closeLayer(); S.toast('Thank you! Your review appears after a quick check.');
    });
  });

  /* ---------- pairs ---------- */
  const order = f.group === 'rendang' ? ['kacang', 'sambal', 'minang', 'daging', 'ayam'] : ['minang', 'daging', 'ayam', 'kacang'];
  const others = order.filter((id) => id !== f.id).slice(0, 4).map((id) => P.byId[id]);
  $('#pairs').innerHTML = others.map((o) => `<article class="p-card" data-card style="--c:${o.color.flood}">
      <a class="p-card__img" href="product.html?p=${o.id}" aria-label="${esc(o.name)}"><img class="packimg" src="${o.pack}" alt="" loading="lazy"><img class="dish" src="${o.dish}" alt="" loading="lazy"></a>
      <h3><a href="product.html?p=${o.id}">${esc(o.name.replace(' Pak Nil', ''))}</a></h3>
      <p class="alt">${esc(o.en)}</p>
      <div class="p-card__row"><span class="p-card__price">${money(o.from)}</span><button class="add-round" type="button" data-add="${o.id}-${o.sizes[0].g}" aria-label="Add ${esc(o.short)} to cart">${icon('i-plus')}</button></div>
    </article>`).join('');

  /* ---------- structured data so Google can show the price ---------- */
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: f.name, image: new URL(f.pack, location.href).href, brand: { '@type': 'Brand', name: 'Rendang Pak Nil' },
    offers: f.sizes.map((z) => ({ '@type': 'Offer', priceCurrency: 'MYR', price: z.price.toFixed(2), availability: 'https://schema.org/InStock', name: P.C.sizeLabel(z.g) }))
  });
  document.head.appendChild(ld);
  S.applyLang();
})();

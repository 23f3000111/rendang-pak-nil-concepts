/* Shared behaviour for every Concept A page: chrome, language, cart, checkout, modals. */
(function () {
  const P = window.PN;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const money = (n) => P.C.money(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arch = (text = '', cls = '') => `<span class="arch ${cls}"><svg class="arch__fill" aria-hidden="true"><use href="#arch"/></svg><svg class="arch__line" aria-hidden="true"><use href="#arch-line"/></svg><span class="arch__text">${text}</span></span>`;

  /* ---------------- language ---------------- */
  let lang = store.get('pn-a-lang', 'en');
  const tr = (key) => (P.t[lang] && P.t[lang][key]) || P.t.en[key] || key;
  function applyLang(scope = document) {
    document.documentElement.lang = lang === 'ms' ? 'ms' : 'en';
    $$('[data-i18n]', scope).forEach((el) => { el.textContent = tr(el.dataset.i18n); });
    $$('[data-i18n-ph]', scope).forEach((el) => { el.placeholder = tr(el.dataset.i18nPh); });
    $$('[data-en]', scope).forEach((el) => { el.textContent = lang === 'ms' && el.dataset.ms ? el.dataset.ms : el.dataset.en; });
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  function setLang(l) {
    lang = l; store.set('pn-a-lang', l); applyLang();
    document.dispatchEvent(new CustomEvent('pn:lang', { detail: l }));
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ---------------- chrome ---------------- */
  const page = document.body.dataset.page;
  const B = P.D.brand, L = P.D.links;
  const top = `
  <header class="site-header"><div class="wrap site-header__in">
    <nav class="nav" aria-label="Main">
      <a href="shop.html" data-nav="shop" data-i18n="nav.shop">Shop</a>
      <a href="serve.html" data-nav="serve" data-i18n="nav.serve">Serving ideas</a>
      <a href="agent.html" data-nav="agent" data-i18n="nav.agent">Become an agent</a>
    </nav>
    <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-expanded="false">${icon('i-menu')}</button>
    <a class="logo" href="index.html" aria-label="Rendang Pak Nil home"><img src="assets/img/brand/badge-sm.webp" alt="" width="240" height="240"><span>Rendang Pak Nil</span></a>
    <div class="actions">
      <a class="where-link" href="index.html#where">${icon('i-pin')}<span data-i18n="nav.where">Where to buy</span></a>
      <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en">EN</button><button type="button" data-lang="ms">BM</button></div>
      <button class="icon-btn cart-btn" type="button" aria-label="Open cart">${icon('i-bag')}<span class="cart-count">0</span></button>
    </div>
  </div></header>
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true" data-lenis-prevent>
    <div class="mobile-menu__top"><img src="assets/img/brand/badge-sm.webp" alt="Rendang Pak Nil" width="64"><button class="icon-btn menu-close" type="button" aria-label="Close menu">${icon('i-close')}</button></div>
    <nav aria-label="Mobile">
      <a href="index.html">Home</a><a href="shop.html" data-i18n="nav.shop">Shop</a><a href="serve.html" data-i18n="nav.serve">Serving ideas</a>
      <a href="agent.html" data-i18n="nav.agent">Become an agent</a><a href="portal.html">Agent portal</a><a href="index.html#where" data-i18n="nav.where">Where to buy</a>
    </nav>
    <div class="lang" role="group" aria-label="Language" style="align-self:flex-start"><button type="button" data-lang="en">EN</button><button type="button" data-lang="ms">BM</button></div>
  </div>`;

  const foot = `
  <footer class="site-footer">
    <span class="footer-arch">${arch('Resipi arwah ibu', 'arch--seal')}</span>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand"><img src="assets/img/brand/badge.webp" alt="Rumpun Selera Warisan × PakNil" width="640" height="639" loading="lazy">
          <p>Rendang Pak Nil: Pak Nil’s late mother’s recipe, cooked by Rumpun Selera, restaurant and caterer since 2001.</p>
          <p class="small">${B.address.join(', ')}<br>${B.phone} &nbsp; ${B.email}</p>
          <div class="socials">
            <a href="${L.facebook}" target="_blank" rel="noopener" aria-label="Rendang Pak Nil on Facebook">${icon('i-facebook')}</a>
            <a href="${L.instagram}" target="_blank" rel="noopener" aria-label="Rendang Pak Nil on Instagram">${icon('i-instagram')}</a>
            <a href="${L.tiktok}" target="_blank" rel="noopener" aria-label="Rendang Pak Nil on TikTok">${icon('i-tiktok')}</a>
            <a href="${L.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp Rendang Pak Nil">${icon('i-whatsapp')}</a>
          </div>
        </div>
        <div class="footer-col"><h4 data-i18n="foot.shop">Shop</h4><ul><li><a href="shop.html">All nine menus</a></li><li><a href="shop.html#set">Build a Raya set</a></li><li><a href="shop.html#boxes">Kenduri &amp; gift boxes</a></li><li><a href="product.html?p=minang">Rendang Minang Pak Nil</a></li></ul></div>
        <div class="footer-col"><h4 data-i18n="foot.serve">Serve</h4><ul><li><a href="serve.html">Serving ideas</a></li><li><a href="index.html#steps">Freezer to plate</a></li><li><a href="serve.html#raya">Raya morning</a></li><li><a href="#" data-chat-open>Ask the kitchen</a></li></ul></div>
        <div class="footer-col"><h4 data-i18n="foot.biz">Business</h4><ul><li><a href="agent.html">Become an agent</a></li><li><a href="agent.html#apply">Agent application</a></li><li><a href="agent.html#kenduri">Kenduri &amp; bulk orders</a></li><li><a href="portal.html">Agent portal</a></li></ul></div>
        <div class="footer-col"><h4 data-i18n="foot.company">About</h4><ul><li><a href="index.html#story">Kisah warisan</a></li><li><a href="index.html#mihas">MIHAS 2026</a></li><li><a href="index.html#where">Where to buy</a></li><li><a href="${L.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></li></ul></div>
      </div>
      <div class="footer-row">
        <div class="mark-row"><span>Produk Keluaran Muslim</span><span>BeSS · Bersih, Selamat, Sihat</span><span>Frozen · Simpan sejukbeku</span></div>
        <div class="pay-row"><b data-i18n="foot.pay">Pay with</b><span>DuitNow QR</span><span>FPX</span><span>Touch ’n Go</span><span>GrabPay</span><span>Visa</span><span>Mastercard</span></div>
      </div>
      <div class="legal"><span>© 2026 Rumpun Selera Enterprise (${B.reg})</span><span>Concept demo for discussion. Not the live website.</span></div>
    </div>
  </footer>
  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="cart" aria-label="Cart" aria-hidden="true">
    <div class="drawer__head"><h2 data-i18n="cart.title">Your cart</h2><button class="icon-btn" type="button" data-close-cart aria-label="Close cart">${icon('i-close')}</button></div>
    <div class="drawer__body" id="cart-lines" data-lenis-prevent></div>
    <div class="drawer__foot">
      <div class="ship-bar" id="ship-bar"><span id="ship-text"></span><div class="ship-bar__track"><div class="ship-bar__fill"></div></div></div>
      <div class="subtotal"><span data-i18n="cart.sub">Subtotal</span><span id="cart-sub">RM0.00</span></div>
      <button class="btn" type="button" id="checkout-btn"><span data-i18n="cart.checkout">Check out</span>${icon('i-arrow')}</button>
    </div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite">${icon('i-check')}<span></span></div>`;

  document.body.insertAdjacentHTML('afterbegin', top);
  document.body.insertAdjacentHTML('beforeend', foot);
  $$('[data-nav]').forEach((a) => { if (a.dataset.nav === page) a.setAttribute('aria-current', 'page'); });

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    if (window.gsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollToEl(target, offset = -96) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.hasAttribute('data-chat-open')) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, '', url.hash);
  });
  window.addEventListener('load', () => {
    if (location.hash) setTimeout(() => scrollToEl(document.getElementById(location.hash.slice(1)), -96), 350);
  });

  /* ---------------- overlays ---------------- */
  const scrim = $('#scrim');
  let openLayer = null;
  /* Lenis stop() already blocks wheel scrolling; hiding overflow as well would trigger a ScrollTrigger refresh and jump the page. */
  function lockScroll(on) { if (lenis) { on ? lenis.stop() : lenis.start(); } else document.documentElement.style.overflow = on ? 'hidden' : ''; }
  function closeLayer() {
    if (!openLayer) return;
    const layer = openLayer; openLayer = null;
    layer.classList.remove('open'); layer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('show'); lockScroll(false);
    $$('video', layer).forEach((v) => v.pause());
    if (layer.dataset.temp) setTimeout(() => layer.remove(), 400);
    if (layer._return) layer._return.focus({ preventScroll: true });
  }
  function showLayer(layer) {
    if (openLayer && openLayer !== layer) closeLayer();
    layer._return = document.activeElement;
    openLayer = layer; layer.classList.add('open'); layer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('show'); lockScroll(true);
    setTimeout(() => { const f = layer.querySelector('input, button, a, [tabindex]'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  scrim.addEventListener('click', closeLayer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLayer(); });

  function modal(html, width = 560) {
    const m = document.createElement('div');
    m.className = 'modal'; m.dataset.temp = '1'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal__box" style="--mw:${width}px" data-lenis-prevent><button class="icon-btn modal__close" type="button" aria-label="Close">${icon('i-close')}</button><div class="modal__content">${html}</div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal__close')) closeLayer(); });
    requestAnimationFrame(() => showLayer(m));
    return m;
  }

  /* any [data-reel] opens their vertical video in a modal, with sound */
  function reel(src, title = '') {
    const m = modal(`${title ? `<h2 class="h3" style="margin-bottom:14px">${esc(title)}</h2>` : ''}<div class="reel-frame" style="width:min(100%,380px);margin:0 auto"><video src="${src}" poster="${src.replace(/\.mp4$/, '.jpg')}" controls autoplay playsinline></video></div>`, 460);
    return m;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-reel]');
    if (!b) return;
    e.preventDefault();
    reel(b.dataset.reel, b.dataset.reelTitle || '');
  });

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.querySelector('span').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* mobile menu */
  const mm = $('#mobile-menu');
  $('.menu-btn').addEventListener('click', () => { mm.classList.add('open'); mm.setAttribute('aria-hidden', 'false'); lockScroll(true); });
  $('.menu-close').addEventListener('click', () => { mm.classList.remove('open'); mm.setAttribute('aria-hidden', 'true'); lockScroll(false); });
  $$('#mobile-menu nav a').forEach((a) => a.addEventListener('click', () => { mm.classList.remove('open'); lockScroll(false); }));

  /* ---------------- cart ----------------
     Lines are SKUs ("minang-500"); a Raya set carries its own price and contents. */
  const FREE_AT = 150; /* proposed: free frozen delivery in the Klang Valley above RM150 */
  const FEE = 15;      /* proposed delivery fee below that */
  let cart = store.get('pn-a-cart', []);
  const lineInfo = (l) => { const s = P.sku(l.id); return s ? { ...s, price: l.price != null ? l.price : s.price } : null; };
  const cartTotal = () => cart.reduce((s, l) => { const i = lineInfo(l); return s + (i ? i.price * l.qty : 0); }, 0);

  function renderCart() {
    cart = cart.filter((l) => lineInfo(l) && l.qty > 0);
    store.set('pn-a-cart', cart);
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $$('.cart-count').forEach((c) => { c.textContent = count; c.classList.toggle('is-zero', !count); });
    const lines = $('#cart-lines');
    if (!cart.length) {
      lines.innerHTML = `<div class="empty-note"><img src="assets/img/packs/minang-sm.webp" alt=""><p data-i18n="cart.empty">${esc(tr('cart.empty'))}</p><a class="btn btn--dark btn--sm" href="shop.html"><span data-i18n="hero.shop">${esc(tr('hero.shop'))}</span></a></div>`;
    } else {
      lines.innerHTML = cart.map((l) => {
        const p = lineInfo(l);
        const sub = l.note ? `<div class="small muted">${esc(l.note)}</div>` : (p.size ? `<div class="small muted">${P.C.sizeLabel(p.size)}</div>` : '');
        return `<div class="cart-line" data-key="${esc(l.key || l.id)}">
          <img src="${p.img}" alt="">
          <div><h3>${esc(p.name)}</h3>${sub}<div class="price">${money(p.price)}</div></div>
          <div class="qty"><button type="button" data-q="-1" aria-label="Less">${icon('i-minus')}</button><output>${l.qty}</output><button type="button" data-q="1" aria-label="More">${icon('i-plus')}</button></div>
        </div>`;
      }).join('');
    }
    const total = cartTotal();
    $('#cart-sub').textContent = money(total);
    const bar = $('#ship-bar');
    const pct = Math.min(100, (total / FREE_AT) * 100);
    bar.querySelector('.ship-bar__fill').style.width = pct + '%';
    bar.classList.toggle('done', total >= FREE_AT);
    $('#ship-text').textContent = total >= FREE_AT ? tr('cart.free') : `${money(FREE_AT - total)} ${tr('cart.more')}`;
    $('#checkout-btn').disabled = !cart.length;
  }
  $('#cart-lines').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const key = b.closest('.cart-line').dataset.key;
    const line = cart.find((l) => (l.key || l.id) === key);
    if (line) { line.qty += Number(b.dataset.q); renderCart(); }
  });

  function flyFrom(srcEl) {
    if (reduced || !srcEl) return;
    const target = $('.cart-btn');
    const s = srcEl.getBoundingClientRect(), t = target.getBoundingClientRect();
    if (!s.width) return;
    const img = document.createElement('img');
    img.className = 'fly'; img.src = srcEl.currentSrc || srcEl.src; img.alt = '';
    img.style.left = (s.left + s.width / 2 - 35) + 'px'; img.style.top = (s.top + s.height / 2 - 42) + 'px';
    document.body.appendChild(img);
    const dx = t.left + t.width / 2 - (s.left + s.width / 2), dy = t.top + t.height / 2 - (s.top + s.height / 2);
    img.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy - 120}px) scale(.8) rotate(-12deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.25) rotate(8deg)`, opacity: 0.6 }
    ], { duration: 820, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => {
      img.remove();
      $$('.cart-count').forEach((c) => { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    };
  }

  function addToCart(id, qty = 1, srcEl, opts = {}) {
    const key = opts.key || id;
    const line = cart.find((l) => (l.key || l.id) === key);
    if (line) line.qty += qty; else cart.push({ id, qty, key, note: opts.note, price: opts.price });
    renderCart();
    flyFrom(srcEl);
    const p = lineInfo({ id, price: opts.price });
    toast(`${tr('cart.added')}: ${p.name}${p.size ? ' ' + P.C.sizeLabel(p.size) : ''}`);
  }
  function openCart() { showLayer($('#cart')); }
  $('.cart-btn').addEventListener('click', openCart);
  $('[data-close-cart]').addEventListener('click', closeLayer);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault();
    const src = b.dataset.srcImg ? $(b.dataset.srcImg) : (b.closest('[data-card]') || b.parentElement).querySelector('img');
    addToCart(b.dataset.add, Number(b.dataset.qty || 1), src);
  });

  /* ---------------- checkout (demo) ---------------- */
  $('#checkout-btn').addEventListener('click', () => {
    const total = cartTotal();
    const ship = total >= FREE_AT ? 0 : FEE;
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const m = modal(`
      <h2 class="h3">Checkout</h2>
      <p class="small muted">Frozen delivery to Nur Aisyah, Taman Melawati, Kuala Lumpur (demo address)</p>
      <div class="brief" style="margin-top:14px">
        <div><dt>${count} pack${count > 1 ? 's' : ''}</dt><dd>${money(total)}</dd></div>
        <div><dt>Delivery</dt><dd>${ship ? money(ship) + ' (frozen courier, proposed fee)' : 'Free frozen delivery (Klang Valley)'}</dd></div>
        <div><dt>Total</dt><dd><b>${money(total + ship)}</b></dd></div>
      </div>
      <fieldset class="pay-opts" style="border:0;padding:0"><legend class="label" style="font-weight:800;margin-bottom:8px">Pay with</legend>
        <label class="pay-opt"><input type="radio" name="pay" value="duitnow" checked>${icon('i-qr')}<span>DuitNow QR<small>Scan with any Malaysian bank or e-wallet app</small></span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="fpx">${icon('i-bank')}<span>FPX online banking<small>Maybank2u, CIMB Clicks, Bank Islam and more</small></span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="tng">${icon('i-wallet')}<span>Touch ’n Go eWallet or GrabPay</span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="card">${icon('i-card')}<span>Visa or Mastercard</span></label>
      </fieldset>
      <button class="btn" type="button" style="width:100%" data-pay>Pay ${money(total + ship)}</button>
      <p class="small muted" style="text-align:center;margin:10px 0 0">Demo only: nothing is charged and no order is sent.</p>`, 520);
    $('[data-pay]', m).addEventListener('click', () => {
      const method = $('input[name="pay"]:checked', m).value;
      const box = $('.modal__content', m);
      if (method === 'duitnow') {
        box.innerHTML = `<h2 class="h3">Scan to pay</h2><p class="small muted">Open any banking or e-wallet app and scan.</p>
          <div style="display:grid;place-items:center;margin:18px 0"><div id="pay-qr" style="padding:12px;background:#fff;border-radius:16px;border:1.5px solid var(--istana)"></div></div>
          <p style="text-align:center;font-weight:700">Waiting for payment… <span class="small muted">(the demo confirms by itself)</span></p>`;
        if (window.QRCode) new QRCode($('#pay-qr', m), { text: 'Rendang Pak Nil concept demo - not a real payment', width: 180, height: 180, colorDark: '#5C0F1F', colorLight: '#ffffff' });
        setTimeout(() => paid(box, total + ship), 2600);
      } else {
        box.innerHTML = `<div class="paid"><span class="typing"><i></i><i></i><i></i></span><p style="font-weight:700">${method === 'fpx' ? 'Connecting to your bank…' : 'Confirming payment…'}</p></div>`;
        setTimeout(() => paid(box, total + ship), 1700);
      }
    });
  });
  function paid(box, amount) {
    const ref = 'PN-26-' + String(Math.floor(10000 + Math.random() * 89999));
    box.innerHTML = `<div class="paid">${arch('✓')}<h2 class="h3">Order ${ref} confirmed</h2>
      <p class="small muted" style="margin:0">${money(amount)} received. A WhatsApp update is on its way.</p>
      <ol class="track" style="list-style:none;padding:0">
        <li class="done"><span><b>Paid</b><br><span class="small muted">Just now</span></span></li>
        <li><span><b>Packed frozen in Selayang</b><br><span class="small muted">Today</span></span></li>
        <li><span><b>Out with the frozen courier</b><br><span class="small muted">Tracking link on WhatsApp</span></span></li>
        <li><span><b>Delivered</b><br><span class="small muted">Into the freezer it goes</span></span></li>
      </ol>
      <button class="btn btn--dark" type="button" data-done>Continue shopping</button></div>`;
    cart = []; renderCart();
    box.querySelector('[data-done]').addEventListener('click', closeLayer);
  }

  /* ---------------- shared bits ---------------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });
  function facts(p) {
    const sizes = p.sizes.map((z) => P.C.sizeLabel(z.g)).join(' · ');
    return `<div class="facts">
      <span class="fact">${icon('i-flame')}<span><span data-i18n="fl.heat">${tr('fl.heat')}</span> 5 <span data-i18n="fl.min">${tr('fl.min')}</span></span></span>
      <span class="fact">${icon('i-box')}<span>${sizes}</span></span>
      <span class="fact">${icon('i-snowflake')}<span>Frozen</span></span>
    </div>`;
  }
  const line = (p) => (lang === 'ms' ? p.lineBm : p.line);

  window.Site = { $, $$, icon, money, esc, arch, tr, applyLang, addToCart, openCart, modal, reel, closeLayer, showLayer, toast, store, scrollToEl, facts, line, reduced, get lenis() { return lenis; }, get lang() { return lang; } };

  applyLang();
  renderCart();
})();

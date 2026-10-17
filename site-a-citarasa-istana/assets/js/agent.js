/* Business page: agent application (five steps to a WhatsApp message), kenduri calculator, MIHAS photos, booth QR, tasting booking, FAQ. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, $$, icon, esc } = S;
  const wa = (text) => P.C.waLink(P.D.links.waNumber, text);

  $('#q-dishes').innerHTML = P.products.map((f) => `<label><input type="checkbox" name="dish" value="${esc(f.name)}"><img src="${f.sm}" alt="" loading="lazy">${esc(f.short)}</label>`).join('');

  /* ---------- agent application ---------- */
  const form = $('#q-form'), panels = $$('.q-panel', form), stepsEl = $$('#q-steps li');
  const back = $('#q-back'), next = $('#q-next'), err = $('#q-error');
  let step = 1, lastHref = '';
  const val = (name) => { const el = form.querySelector(`[name="${name}"]:checked`); return el ? el.value : ''; };
  const vol = $('#q-vol');
  function updateVol() {
    const v = Number(vol.value);
    $('#q-vol-out').textContent = `${v} packs a month`;
    $('#q-kg').textContent = `About ${Math.round(v * 0.5)}–${v} kg of rendang`;
  }
  vol.addEventListener('input', updateVol); updateVol();

  function message() {
    const dishes = $$('[name="dish"]:checked', form).map((x) => x.value);
    return P.C.agentMessage({
      name: $('#q-name').value.trim(), phone: $('#q-wa').value.trim(), area: `${$('#q-town').value.trim()}, ${$('#q-area').value}`,
      channel: val('type'), freezer: val('freezer'), volume: `${vol.value} pek sebulan`,
      note: [dishes.length ? 'Menu: ' + dishes.join(', ') : '', val('when') ? 'Mula: ' + val('when') : '', $('#q-mail').value.trim()].filter(Boolean).join(' · ')
    });
  }
  function go(n) {
    step = n;
    panels.forEach((p) => p.classList.toggle('is-on', Number(p.dataset.step) === n));
    stepsEl.forEach((li, i) => { li.classList.toggle('is-on', i + 1 === Math.min(n, 5)); li.classList.toggle('is-done', i + 1 < n); });
    back.hidden = n === 1 || n === 7;
    next.hidden = n === 7;
    next.textContent = n === 5 ? 'Review application' : n === 6 ? 'Send on WhatsApp' : 'Next';
    err.textContent = '';
    if (n === 6) {
      const dishes = $$('[name="dish"]:checked', form).map((x) => x.value).join(', ');
      const rows = [['Agent type', val('type')], ['Menus', dishes], ['Each month', $('#q-vol-out').textContent], ['Freezer', val('freezer')],
        ['Area', `${$('#q-town').value}, ${$('#q-area').value}`], ['Start', val('when') || 'Not set'], ['Contact', `${$('#q-name').value}, ${$('#q-wa').value}`]];
      $('#q-brief').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
    }
    if (n === 7) $('#q-ref').textContent = 'Application AG-' + (2600 + Math.floor(Math.random() * 99)) + ' ready';
    const top = form.getBoundingClientRect().top;
    if (top < 80) S.scrollToEl($('#apply .quote'), -100);
  }
  function check() {
    if (step === 1 && !val('type')) return 'Choose the kind of agent you are.';
    if (step === 2 && !$$('[name="dish"]:checked', form).length) return 'Pick at least one menu.';
    if (step === 5) {
      const ids = ['#q-name', '#q-wa', '#q-town'];
      ids.forEach((s) => $(s).closest('.field').classList.toggle('err', !$(s).value.trim()));
      if (ids.some((s) => !$(s).value.trim())) return 'Add your name, WhatsApp number and town.';
      if ($('#q-wa').value.replace(/\D/g, '').length < 9) { $('#q-wa').closest('.field').classList.add('err'); return 'That WhatsApp number looks too short.'; }
    }
    return '';
  }
  next.addEventListener('click', () => {
    const m = check();
    if (m) { err.textContent = m; return; }
    if (step === 6) {
      lastHref = wa(message());
      $('#q-again').href = lastHref;
      window.open(lastHref, '_blank', 'noopener');
      S.toast('WhatsApp opens with your application. Nothing is sent until you press send.');
    }
    go(step + 1);
  });
  back.addEventListener('click', () => go(step - 1));
  form.addEventListener('submit', (e) => e.preventDefault());
  $('#q-again').addEventListener('click', (e) => { if (!lastHref) e.preventDefault(); });

  /* ---------- kenduri calculator ---------- */
  const guests = $('#c-guests'), menu = $('#c-menu');
  function calc() {
    const n = Number(guests.value), dishes = Number(menu.value);
    const lo = Math.ceil(n / 8), hi = Math.ceil(n / 4);
    $('#c-guests-out').textContent = `${n} guests`;
    $('#c-packs').textContent = lo === hi ? String(lo) : `${lo}–${hi}`;
    $('#c-detail').textContent = `1 kg packs in total${dishes > 1 ? `, split across ${['', 'one', 'two', 'three'][dishes]} rendang` : ''}. Fewer if there are many other dishes, more if rendang is the star.`;
    $('#c-send').href = wa(P.C.bulkMessage({ event: 'Kenduri', guests: String(n), items: [`${lo}–${hi} pek 1 kg, ${dishes} jenis rendang`], note: 'Dari kalkulator kenduri di laman web' }));
  }
  guests.addEventListener('input', calc); menu.addEventListener('change', calc); calc();

  /* ---------- MIHAS photos ---------- */
  const photos = P.D.media.mihasPhotos.slice(0, 4);
  $('#expos').innerHTML = photos.map((p) => `<figure class="expo"><img src="assets/${p.src}" alt="${esc(p.alt)}" loading="lazy"><figcaption>${esc(p.alt)}</figcaption></figure>`).join('');

  /* ---------- booth QR ---------- */
  if (window.QRCode) new QRCode($('#booth-qr'), { text: location.href.split('#')[0] + '?src=booth#apply', width: 130, height: 130, colorDark: '#5C0F1F', colorLight: '#ffffff' });

  /* ---------- tasting booking ---------- */
  function days() {
    const out = [], d = new Date();
    while (out.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) out.push(new Date(d)); }
    return out;
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-book]')) return;
    const ds = days();
    const m = S.modal(`<h2 class="h3">Book a tasting</h2><p class="small muted">With the Rumpun Selera team. Demo: no booking is made.</p>
      <div class="where__tabs" role="group" aria-label="Where" style="margin:12px 0">${['At the Selayang kitchen', 'Video call', 'At the next expo'].map((x, i) => `<button class="chip" type="button" data-mode aria-pressed="${!i}">${x}</button>`).join('')}</div>
      <div class="label" style="font-weight:800">Day</div><div class="slot-grid" data-group="day">${ds.map((d, i) => `<button type="button" aria-pressed="${!i}">${d.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })}</button>`).join('')}</div>
      <div class="label" style="font-weight:800">Time</div><div class="slot-grid" data-group="time">${['10:00', '11:30', '14:30', '15:30', '16:30', '17:30'].map((t, i) => `<button type="button" aria-pressed="${i === 1}">${t}</button>`).join('')}</div>
      <button class="btn" type="button" style="width:100%" data-confirm>Confirm tasting</button>`, 560);
    m.addEventListener('click', (ev) => {
      const b = ev.target.closest('.slot-grid button, [data-mode]');
      if (b) { const grp = b.parentElement; $$('button', grp).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }
      if (ev.target.closest('[data-confirm]')) {
        const day = $('[data-group="day"] [aria-pressed="true"]', m).textContent, time = $('[data-group="time"] [aria-pressed="true"]', m).textContent;
        S.closeLayer(); S.toast(`Tasting booked for ${day}, ${time} (demo).`);
      }
    });
  });

  /* ---------- FAQ ---------- */
  const faqs = P.D.faqs.filter((q) => ['business', 'order', 'trust'].includes(q.cat));
  $('#faq').innerHTML = faqs.map((q, i) => `<details${i ? '' : ' open'}><summary>${esc(q.q)}${icon('i-chevron')}</summary><div class="acc__body"><p>${esc(q.a)}</p></div></details>`).join('');

})();

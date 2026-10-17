/* Tanya Dapur: a scripted stand-in for an assistant run by the Rendang Pak Nil kitchen team (never "Pak Nil" himself).
   Keyword intents in English and BM; the agent sign-up ends in a ready WhatsApp message the visitor sends. */
(function () {
  const P = window.PN, S = window.Site;
  const { $, icon, esc, arch, tr } = S;

  const L = {
    en: {
      hello: 'Hi, this is the Rendang Pak Nil kitchen. I can explain how to heat a pack, suggest a rendang, track an order or sign you up as an agent. What would you like?',
      chips: ['How do I heat it?', 'Which rendang should I try?', 'Is it halal?', 'Do you deliver?', 'Track my order', 'I want to be an agent'],
      heat: 'Three steps, straight from the pack: thaw it first, then heat it in the microwave or in a wok without any cooking oil. It is on the table in about five minutes.',
      heatLink: 'See the three steps',
      halal: 'Every pack carries the Produk Keluaran Muslim (Muslim-made) mark and the BeSS mark (Bersih, Selamat dan Sihat), and it is cooked in Rumpun Selera’s kitchen, a restaurant and caterer since 2001. For certificate details, the team will answer on WhatsApp.',
      pick: 'Start with the one Pak Nil grew up with:', pickOther: 'Prefer chicken? Rendang Ayam. Kenduri? Rendang Paru and the 1 kg packs.',
      add: (p) => `Add ${p}`, view: 'View',
      spicy: 'Rendang Minang has a balanced heat: rich in spice rather than fiery. Kuah Sambal Serbaguna is the one with the real chilli kick.',
      ship: 'Yes. Packs travel frozen. On this concept, delivery in the Klang Valley is free above RM150 and RM15 below (a proposal the team would confirm). For other areas the team arranges it on WhatsApp.',
      where: 'On this website, on WhatsApp (+60 11-6982 5208), at Asam Pedas London, and at events like MIHAS 2026, where Rumpun Selera Warisan had booths 10B04 and 10B05.', whereLink: 'Open the map',
      price: 'Kuah Sambal Serbaguna and Kuah Kacang start at RM28 (1 kg). Rendang Minang Pak Nil is RM48 for 500 g or RM85 for 1 kg.', priceLink: 'See all nine menus',
      store: 'Keep it frozen (simpan sejukbeku). The best-before date is printed on every pack. Thaw only what you plan to heat.',
      serves: 'Their kitchen says one pack serves 2 to 4. For a kenduri, the 1 kg packs are the easy way.',
      trackAsk: 'Sure. What is your order number? It starts with PN, for example PN-26-04817.',
      trackDone: (n) => `Order ${n} is on its way.`, track: ['Paid', 'Packed frozen in Selayang', 'Out with the frozen courier', 'Arrives tomorrow'],
      agentStart: 'Great, let’s put your agent application together. What kind of agent are you?',
      agentType: ['Reseller or dropship', 'Shop or kedai runcit', 'Office or community', 'Kenduri or catering'],
      agentHow: 'How will you sell?', agentHowC: ['WhatsApp groups', 'Social media', 'My shop', 'Events and bazaars'],
      agentFreezer: 'Frozen packs need freezer space. Do you have some?', agentFreezerC: ['Yes, a chest freezer', 'A small freezer', 'Not yet'],
      agentVol: 'Roughly how many packs a month?', agentVolC: ['Under 20 packs', '20 to 50 packs', 'More than 50'],
      agentWho: 'Last one: your name, area and WhatsApp number.', agentWhoPh: 'Name, area, WhatsApp number',
      agentSum: 'Here is your application:', agentLabels: ['Agent type', 'Selling through', 'Freezer', 'Each month', 'Contact'],
      agentSend: 'Send on WhatsApp', agentSent: 'WhatsApp is opening with your application ready to send. The team will reply with the agent prices.', agentPage: 'Read about the agent programme',
      fallback: 'I can help with heating, storage, delivery, the menu and becoming an agent. Try one of these:',
      demoNote: 'Demo only: nothing is sent until you press send in WhatsApp.'
    },
    ms: {
      hello: 'Assalamualaikum, ini dapur Rendang Pak Nil. Saya boleh terangkan cara panaskan, cadangkan rendang, semak pesanan atau daftarkan anda sebagai agen. Apa yang anda perlukan?',
      chips: ['Macam mana nak panaskan?', 'Rendang mana patut cuba?', 'Halal ke?', 'Ada penghantaran?', 'Semak pesanan saya', 'Saya nak jadi agen'],
      heat: 'Tiga langkah, seperti di pek: nyahbeku dahulu, kemudian panaskan dalam microwave atau dalam kuali tanpa minyak masak. Siap dalam lebih kurang lima minit.',
      heatLink: 'Lihat tiga langkah',
      halal: 'Setiap pek ada logo Produk Keluaran Muslim dan logo BeSS (Bersih, Selamat dan Sihat), dan dimasak di dapur Rumpun Selera, restoran dan katering sejak 2001. Untuk butiran sijil, pasukan kami akan jawab di WhatsApp.',
      pick: 'Mulakan dengan rendang zaman kecil Pak Nil:', pickOther: 'Suka ayam? Rendang Ayam. Kenduri? Rendang Paru dan pek 1 kg.',
      add: (p) => `Tambah ${p}`, view: 'Lihat',
      spicy: 'Rendang Minang pedasnya seimbang: kaya rempah, bukan berapi. Kuah Sambal Serbaguna yang betul-betul pedas.',
      ship: 'Ada. Pek dihantar beku. Dalam konsep ini, penghantaran di Lembah Klang percuma melebihi RM150 dan RM15 di bawahnya (cadangan, akan disahkan pasukan). Kawasan lain diuruskan di WhatsApp.',
      where: 'Di laman web ini, di WhatsApp (+60 11-6982 5208), di Asam Pedas London, dan di acara seperti MIHAS 2026, di booth 10B04 dan 10B05.', whereLink: 'Buka peta',
      price: 'Kuah Sambal Serbaguna dan Kuah Kacang bermula RM28 (1 kg). Rendang Minang Pak Nil RM48 untuk 500 g atau RM85 untuk 1 kg.', priceLink: 'Lihat sembilan menu',
      store: 'Simpan sejukbeku. Tarikh baik sebelum dicetak pada setiap pek. Nyahbeku apa yang nak dipanaskan sahaja.',
      serves: 'Dapur kami kata satu pek untuk 2 hingga 4 orang. Untuk kenduri, pek 1 kg paling mudah.',
      trackAsk: 'Boleh. Apa nombor pesanan anda? Ia bermula dengan PN, contohnya PN-26-04817.',
      trackDone: (n) => `Pesanan ${n} sedang dalam perjalanan.`, track: ['Dibayar', 'Dibungkus beku di Selayang', 'Dihantar kurier sejuk beku', 'Sampai esok'],
      agentStart: 'Bagus, mari sediakan permohonan agen anda. Anda agen jenis apa?',
      agentType: ['Reseller atau dropship', 'Kedai atau kedai runcit', 'Pejabat atau komuniti', 'Kenduri atau katering'],
      agentHow: 'Macam mana anda akan jual?', agentHowC: ['Grup WhatsApp', 'Media sosial', 'Kedai saya', 'Acara dan bazar'],
      agentFreezer: 'Pek beku perlukan ruang peti sejuk beku. Ada?', agentFreezerC: ['Ada, peti beku besar', 'Peti beku kecil', 'Belum ada'],
      agentVol: 'Anggaran berapa pek sebulan?', agentVolC: ['Bawah 20 pek', '20 hingga 50 pek', 'Lebih 50'],
      agentWho: 'Akhir sekali: nama, kawasan dan nombor WhatsApp anda.', agentWhoPh: 'Nama, kawasan, nombor WhatsApp',
      agentSum: 'Ini permohonan anda:', agentLabels: ['Jenis agen', 'Cara jualan', 'Peti beku', 'Sebulan', 'Hubungi'],
      agentSend: 'Hantar di WhatsApp', agentSent: 'WhatsApp sedang dibuka dengan permohonan anda. Pasukan kami akan balas dengan harga agen.', agentPage: 'Baca tentang program agen',
      fallback: 'Saya boleh bantu tentang cara panaskan, simpanan, penghantaran, menu dan jadi agen. Cuba ini:',
      demoNote: 'Demo sahaja: tiada apa dihantar sehingga anda tekan hantar di WhatsApp.'
    }
  };
  const lg = () => L[S.lang] || L.en;

  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'chat-fab';
  fab.innerHTML = `${arch('D')}<span class="label" data-i18n="chat.open">${tr('chat.open')}</span>`;
  const panel = document.createElement('section');
  panel.className = 'chat'; panel.setAttribute('aria-label', 'Tanya Dapur chat'); panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="chat__head">${arch('D')}<div><h2 data-i18n="chat.title">Tanya Dapur</h2><p data-i18n="chat.sub">${tr('chat.sub')}</p></div>
      <button class="icon-btn" type="button" data-chat-close aria-label="Close chat">${icon('i-close')}</button></div>
    <div class="chat__lang"><span>${icon('i-globe')}</span><button type="button" data-lang="en">EN</button><button type="button" data-lang="ms">BM</button></div>
    <div class="chat__log" aria-live="polite" data-lenis-prevent></div>
    <div class="chat__chips"></div>
    <form class="chat__form" autocomplete="off"><label class="sr-only" for="chat-in">Message</label><input id="chat-in" type="text" data-i18n-ph="chat.ph" placeholder="${esc(tr('chat.ph'))}"><button type="submit" aria-label="Send">${icon('i-send')}</button></form>`;
  document.body.append(fab, panel);
  S.applyLang();
  const log = $('.chat__log', panel), chipsEl = $('.chat__chips', panel), input = $('#chat-in', panel);
  let started = false, flow = null, data = {};

  function open() {
    panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); fab.classList.add('hide');
    if (!started) { started = true; bot(lg().hello, { chips: lg().chips }); }
    setTimeout(() => input.focus({ preventScroll: true }), 300);
  }
  function close() { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); fab.classList.remove('hide'); }
  fab.addEventListener('click', open);
  $('[data-chat-close]', panel).addEventListener('click', close);
  document.addEventListener('click', (e) => { if (e.target.closest('[data-chat-open]')) { e.preventDefault(); open(); } });
  document.addEventListener('pn:lang', () => { if (started && !flow) setChips(lg().chips); });

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  function me(text) { const d = document.createElement('div'); d.className = 'msg msg--me'; d.textContent = text; log.appendChild(d); scroll(); }
  function bot(html, opts = {}) {
    setChips([]);
    const t = document.createElement('div'); t.className = 'msg msg--bot typing'; t.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t); scroll();
    setTimeout(() => {
      t.remove();
      const d = document.createElement('div'); d.className = 'msg msg--bot';
      d.innerHTML = `<p>${html}</p>${opts.extra || ''}`;
      log.appendChild(d); scroll();
      if (opts.chips) setChips(opts.chips);
      if (opts.after) opts.after(d);
    }, opts.delay || 650 + Math.random() * 450);
  }
  function setChips(list) {
    chipsEl.innerHTML = '';
    list.forEach((c) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c; b.addEventListener('click', () => handle(c)); chipsEl.appendChild(b); });
  }

  const has = (s, re) => re.test(s.toLowerCase());
  function productIn(s) {
    const map = [['ayam-special', /special|pedal|hati|kaki ayam/], ['dendeng', /dendeng|perak|istana/], ['minang', /minang/], ['paru', /paru|lung/],
      ['laksa', /laksa/], ['kacang', /kacang|peanut|satay|sate/], ['sambal', /sambal/], ['ayam', /ayam|chicken/], ['daging', /daging|beef/]];
    const hit = map.find(([, re]) => re.test(s.toLowerCase()));
    return hit ? P.byId[hit[0]] : null;
  }
  function productCard(p) {
    const z = p.sizes[0];
    return `<div class="card"><img src="${p.dish}" alt=""><div><strong>${esc(p.name)}</strong>
      <span class="small muted">${esc(S.line(p))}</span>
      <div class="row"><a class="btn btn--sm btn--dark" href="product.html?p=${p.id}">${esc(lg().view)}</a>
      <button class="btn btn--sm" type="button" data-add="${p.id}-${z.g}">${esc(lg().add(P.C.sizeLabel(z.g) + ', ' + S.money(z.price)))}</button></div></div></div>`;
  }
  const linkP = (href, label) => `<p style="margin-top:8px"><a class="link-arrow" href="${href}">${esc(label)}${icon('i-arrow')}</a></p>`;

  function handle(text) {
    const s = text.trim();
    if (!s) return;
    me(s); input.value = '';
    const T = lg();
    if (flow) return step(s);
    if (has(s, /agen|agent|reseller|dropship|jual|sell|peluang|business|perniagaan/)) { flow = 'agent'; data = {}; return bot(T.agentStart, { chips: T.agentType }); }
    if (has(s, /track|order|pesanan|pn-|parcel|bungkusan|semak/)) { flow = 'track'; return bot(T.trackAsk); }
    if (has(s, /halal|jakim|muslim|bess/)) return bot(T.halal, { chips: T.chips.filter((_, i) => i !== 2) });
    if (has(s, /heat|panas|microwave|wok|kuali|thaw|nyahbeku|cook|masak|prepare|sedia/)) return bot(T.heat, { extra: linkP('index.html#steps', T.heatLink), chips: T.chips.filter((_, i) => i !== 0) });
    if (has(s, /spic|pedas|hot/)) return bot(T.spicy, { chips: T.chips });
    if (has(s, /store|simpan|freezer|beku|expir|tahan|shelf/)) return bot(T.store, { chips: T.chips });
    if (has(s, /serve|how many|berapa orang|orang|people|kenduri|portion/)) return bot(T.serves, { chips: T.chips });
    if (has(s, /ship|deliver|hantar|courier|postage|penghantaran/)) return bot(T.ship, { chips: T.chips });
    if (has(s, /where|kedai|beli|buy|store|lokasi|asam pedas|mihas/)) return bot(T.where, { extra: linkP('index.html#where', T.whereLink), chips: T.chips });
    if (has(s, /price|harga|berapa|how much|rm/)) return bot(T.price, { extra: linkP('shop.html', T.priceLink), chips: T.chips });
    const p = productIn(s);
    if (p) return bot(esc(S.line(p)), { extra: productCard(p), chips: T.chips });
    if (has(s, /try|cuba|which|mana|recommend|cadang|suggest/)) return bot(T.pick, { extra: productCard(P.byId.minang) + `<p style="margin-top:8px">${esc(T.pickOther)}</p>`, chips: T.chips.filter((_, i) => i !== 1) });
    if (has(s, /^(hi|hello|hai|salam|assalam|hey)/)) return bot(T.hello, { chips: T.chips });
    bot(T.fallback, { chips: T.chips });
  }

  function step(s) {
    const T = lg();
    if (flow === 'track') {
      flow = null;
      const n = (s.match(/pn-?\d{2}-?\d{3,6}/i) || ['PN-26-04817'])[0].toUpperCase();
      const steps = T.track.map((x, i) => `<li class="${i < 3 ? 'done' : ''}"><span>${esc(x)}</span></li>`).join('');
      return bot(esc(T.trackDone(n)), { extra: `<ol class="track" style="list-style:none;padding:0;margin-top:10px">${steps}</ol>`, chips: T.chips });
    }
    if (flow === 'agent') {
      if (!data.type) { data.type = s; return bot(T.agentHow, { chips: T.agentHowC }); }
      if (!data.how) { data.how = s; return bot(T.agentFreezer, { chips: T.agentFreezerC }); }
      if (!data.freezer) { data.freezer = s; return bot(T.agentVol, { chips: T.agentVolC }); }
      if (!data.vol) { data.vol = s; input.placeholder = T.agentWhoPh; return bot(T.agentWho); }
      data.who = s; flow = null; input.placeholder = tr('chat.ph');
      const rows = [data.type, data.how, data.freezer, data.vol, data.who].map((v, i) => `<div><b>${esc(T.agentLabels[i])}:</b> ${esc(v)}</div>`).join('');
      const msg = P.C.agentMessage({ name: data.who, channel: data.type + ' / ' + data.how, freezer: data.freezer, volume: data.vol });
      const href = P.C.waLink(P.D.links.waNumber, msg);
      return bot(T.agentSum, {
        extra: `<div class="summary">${rows}</div><p style="margin-top:10px"><a class="btn btn--sm" href="${href}" target="_blank" rel="noopener" data-send-lead>${icon('i-whatsapp')}${esc(T.agentSend)}</a></p>`,
        after: (d) => d.querySelector('[data-send-lead]').addEventListener('click', () => {
          S.toast(T.demoNote);
          bot(T.agentSent, { extra: linkP('agent.html', T.agentPage), chips: T.chips });
        })
      });
    }
  }

  $('.chat__form', panel).addEventListener('submit', (e) => { e.preventDefault(); handle(input.value); });
  window.Chat = { open, ask: (q) => { open(); setTimeout(() => handle(q), started ? 100 : 1300); } };
  if (new URLSearchParams(location.search).has('chat')) setTimeout(open, 900);
})();

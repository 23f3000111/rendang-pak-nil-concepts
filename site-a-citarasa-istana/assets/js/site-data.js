/* Concept A view model: shared content (data.js) + what only this concept needs:
   serving ideas and the EN/BM interface strings. */
window.PN = (function () {
  const D = window.PAKNIL.data, C = window.PAKNIL.core;
  const A = 'assets/';
  const products = D.products.map((p) => ({
    ...p,
    pack: A + p.img.pack, sm: A + p.img.sm, dish: A + p.img.dish, clip: A + p.img.clip, clipPoster: A + p.img.clipPoster,
    warisanImgs: (p.warisan || []).map((w) => A + 'img/' + w),
    from: Math.min(...p.sizes.map((z) => z.price))
  }));
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  /* cart items are SKUs ("minang-500") plus a few concept extras */
  const skus = C.skuMap(D);
  const extras = {
    'set-3': { id: 'set-3', kind: 'bundle', name: 'Raya set (any 3)', label: 'Pick any three packs', price: 0, img: A + 'img/packs/minang-sm.webp', placeholder: true },
    'box-kenduri': { id: 'box-kenduri', kind: 'bundle', name: 'Kenduri box', label: '4 × 1 kg packs of your choice', price: 0, img: A + 'img/photos/range-table.webp', placeholder: true },
    'stock-up': { id: 'stock-up', kind: 'bundle', name: 'Freezer stock-up', label: 'Four packs a month', price: 0, img: A + 'img/packs/daging-sm.webp', placeholder: true }
  };
  const sku = (id) => {
    const s = skus[id] || extras[id];
    if (!s) return null;
    return { ...s, img: s.img && !s.img.startsWith(A) ? A + s.img : s.img };
  };

  const serve = [
    { id: 'pagi-raya', title: 'Raya morning plate', bm: 'Hidangan pagi Raya', cat: 'raya', products: ['minang', 'kacang'], mins: 10, serves: '4',
      img: A + 'img/stills/kuah-kacang-bowl.webp', video: A + 'video/reel-raya.mp4',
      note: 'Ketupat, rendang and kuah kacang: the plate every Raya morning needs.',
      need: ['1 pack Rendang Minang Pak Nil (500 g)', '1 pack Kuah Kacang (1 kg)', 'Ketupat or nasi impit', 'Sliced cucumber and onion'],
      steps: ['Thaw both packs overnight in the fridge.', 'Heat the rendang in a wok without oil, and warm the kuah kacang in a pot, stirring.', 'Cut the ketupat, pour over the kuah kacang and serve the rendang on the side.'] },
    { id: 'lunchbox', title: 'Lunchbox rendang rice', bm: 'Bekal nasi rendang', cat: 'everyday', products: ['minang'], mins: 5, serves: '1–2',
      img: A + 'img/stills/bekal.webp', video: A + 'video/reel-bekal.mp4',
      note: 'Their customers pack it for school and the office. Mak and ayah eat well too.',
      need: ['A few spoonfuls of Rendang Minang Pak Nil', 'Hot rice', 'Cucumber or a fried egg'],
      steps: ['Thaw the pack the night before.', 'Heat a few spoonfuls in the microwave in the morning.', 'Pack it with hot rice and close the lid while it is warm.'] },
    { id: 'after-work', title: 'Rendang after a long day', bm: 'Rendang balik kerja', cat: 'everyday', products: ['daging'], mins: 5, serves: '2–4',
      img: A + 'img/stills/busy-mum.webp', video: A + 'video/reel-busy.mp4',
      note: 'Home late and craving rendang? It is on the table in under five minutes.',
      need: ['1 pack Rendang Daging (500 g)', 'Hot rice'],
      steps: ['Move the pack from the freezer to the fridge in the morning.', 'At night, heat it in a wok without oil or in the microwave.', 'Serve with hot rice.'] },
    { id: 'laksa-johor', title: 'Laksa Johor with spaghetti', bm: 'Laksa Johor spageti', cat: 'kuah', products: ['laksa'], mins: 15, serves: '4–6',
      img: A + 'video/clip-laksa.jpg', video: A + 'video/reel-menu.mp4',
      note: 'Johor laksa is served over spaghetti. Their customers say the gravy is thick and the fish tastes fresh.',
      need: ['1 pack Kuah Laksa Johor (1 kg)', '500 g spaghetti', 'Cucumber, bean sprouts and daun kesum', 'Sambal belacan'],
      steps: ['Thaw the kuah laksa and heat it in a pot until it bubbles.', 'Boil the spaghetti and drain it.', 'Pour the gravy over the spaghetti and top with the ulam and sambal belacan.'] },
    { id: 'nasi-lemak', title: 'Nasi lemak with sambal', bm: 'Nasi lemak sambal', cat: 'kuah', products: ['sambal', 'minang'], mins: 10, serves: '4',
      img: A + 'img/stock/nasi-rendang-leaf.webp', video: null,
      note: 'Kuah Sambal Serbaguna is the sambal; add Rendang Minang for the full plate.',
      need: ['Kuah Sambal Serbaguna', 'Rendang Minang Pak Nil (optional)', 'Nasi lemak, egg, ikan bilis, peanuts and cucumber'],
      steps: ['Thaw and warm the sambal in a pan.', 'Heat the rendang in a wok without oil.', 'Plate the nasi lemak with a spoon of sambal and the rendang on the side.'] },
    { id: 'satay-night', title: 'Satay night with kuah kacang', bm: 'Malam sate', cat: 'kuah', products: ['kacang'], mins: 10, serves: '6–8',
      img: A + 'img/stock/satay-kuah-kacang.webp', video: null,
      note: 'Kuah Kacang goes over ketupat at Raya and next to satay all year round.',
      need: ['1 pack Kuah Kacang (1 kg)', 'Satay', 'Nasi impit, cucumber and onion'],
      steps: ['Thaw the kuah kacang and warm it in a pot, stirring so it does not catch.', 'Grill or pan-fry the satay.', 'Serve with nasi impit, cucumber and onion.'] },
    { id: 'campfire', title: 'Campfire rendang', bm: 'Rendang perkhemahan', cat: 'outdoor', products: ['minang'], mins: 10, serves: '2–4',
      img: A + 'img/stills/camping-river.webp', video: A + 'video/reel-river.mp4',
      note: 'Their own camping trips: thaw, warm it in the pan and eat it by the river.',
      need: ['1 pack Rendang Minang Pak Nil', 'A cooler box', 'Hot rice'],
      steps: ['Pack it frozen in the cooler box; it thaws on the way.', 'Warm it in the camping pan without oil.', 'Eat with hot rice by the river.'] },
    { id: 'kenduri', title: 'A kenduri table', bm: 'Hidangan kenduri', cat: 'raya', products: ['daging', 'paru', 'ayam'], mins: 20, serves: '20+',
      img: A + 'img/stills/spread-table.webp', video: A + 'video/reel-spread.mp4',
      note: 'The 1 kg packs are made for big tables. Mix daging, paru and ayam.',
      need: ['1 kg packs: Rendang Daging, Rendang Paru, Rendang Ayam', 'Nasi minyak or nasi putih', 'Acar and papadom'],
      steps: ['Thaw the packs a day ahead in the fridge.', 'Heat each one in a large wok without oil.', 'Serve in separate dishes with nasi minyak.'] },
    { id: 'pak-nil-way', title: 'The Pak Nil way', bm: 'Cara Pak Nil', cat: 'everyday', products: ['minang'], mins: 5, serves: '2–4',
      img: A + 'img/stills/paknil-plate.webp', video: A + 'video/reel-cook.mp4',
      note: '“Semudah itu”: Pak Nil warms the rendang in a pan and plates it in seconds.',
      need: ['1 pack Rendang Minang Pak Nil', 'Hot rice'],
      steps: ['Thaw the pack.', 'Warm it in a pan without oil, stirring gently.', 'Plate it with hot rice.'] }
  ];

  const t = {
    en: {
      'nav.shop': 'Shop', 'nav.serve': 'Serving ideas', 'nav.agent': 'Become an agent', 'nav.where': 'Where to buy',
      'hero.marquee1': 'Warisan keluarga', 'hero.marquee2': 'Citarasa istana', 'hero.marquee3': 'Family recipe, palace taste',
      'hero.title': 'Slow-cooked for hours. Ready in five minutes.',
      'hero.sub': 'Pak Nil’s late mother’s Minang recipe, cooked low until the oil separates, then frozen. Thaw, heat, serve.',
      'hero.seal': 'Ready in 5 minutes', 'hero.shop': 'Shop the rendang', 'hero.shopNote': 'From RM28', 'hero.agent': 'Become an agent', 'hero.agentNote': 'Agents, kenduri and bulk orders',
      'tick.1': 'Pak Nil’s mother’s recipe', 'tick.2': 'Cooked until the oil splits', 'tick.3': 'Ready in 5 minutes', 'tick.4': 'One pack serves 2 to 4', 'tick.5': 'Muslim-made', 'tick.6': 'Rumpun Selera’s kitchen since 2001',
      'trust.mihas': 'Exhibited at MIHAS 2026', 'trust.mihasSub': 'Booth 10B04 & 10B05, MITEC Kuala Lumpur',
      'fl.label': 'Nine menus', 'fl.add': 'Add to cart', 'fl.serve': 'How to serve', 'fl.heat': 'Heat', 'fl.min': 'min',
      'steps.title': 'From freezer to plate, in three steps.', 'steps.sub': 'No pounding, no hours at the stove. The slow part was done in the kitchen.',
      'steps.seal': 'No oil needed',
      'doors.kitchen': 'For your table', 'doors.kitchenTitle': 'Pick any three for Raya.', 'doors.kitchenBody': 'Mix rendang and kuah however your family eats. A set of three saves 5% (proposed offer).', 'doors.kitchenCta': 'Build my Raya set',
      'doors.biz': 'For your business', 'doors.bizTitle': 'Sell Rendang Pak Nil.', 'doors.bizBody': 'Agents, resellers, kenduri planners and corporate orders, supplied from Rumpun Selera’s kitchen.', 'doors.bizCta': 'Apply to be an agent',
      'mihas.title': 'From his mother’s kitchen to MIHAS 2026.', 'mihas.body': 'In September 2026 Rumpun Selera Warisan exhibited at MIHAS for the first time, with Pak Nil on the Pocket Talk stage and the new Warisan × PakNil packs on the booth.',
      'mihas.s1': 'booths at MITEC', 'mihas.s2': 'days of MIHAS', 'mihas.s3': 'Rumpun Selera since', 'mihas.cta': 'See the new packs',
      'serve.title': 'Serving ideas, from their own videos.', 'serve.all': 'All serving ideas',
      'rev.title': 'In their customers’ words.', 'rev.note': 'Testimonials from rendangpaknil.com, in BM with an English line.',
      'story.title': 'A mother’s rendang, kept exactly as she made it.', 'story.nameTitle': 'Why “Citarasa Istana”?', 'story.name': 'Rendang Dendeng Perak takes its cue from the palace recipe of Kuala Kangsar, Perak: warisan keluarga, citarasa istana.',
      'where.title': 'Find Rendang Pak Nil.', 'where.kitchen': 'The kitchen', 'where.online': 'Online', 'where.events': 'Events',
      'club.title': 'Get first call on Raya stock.', 'club.body': 'Join the WhatsApp list and the team will message you when Raya orders open. Leave any time.', 'club.ph': 'WhatsApp number', 'club.cta': 'Join the list', 'club.done': 'You are on the list. The team will WhatsApp you when Raya orders open.',
      'foot.shop': 'Shop', 'foot.serve': 'Serve', 'foot.biz': 'Business', 'foot.company': 'About', 'foot.pay': 'Pay with',
      'cart.title': 'Your cart', 'cart.empty': 'Your cart is empty. Start with the rendang Pak Nil grew up with.', 'cart.free': 'Free frozen delivery unlocked (Klang Valley).', 'cart.more': 'more for free frozen delivery in the Klang Valley', 'cart.sub': 'Subtotal', 'cart.checkout': 'Check out', 'cart.added': 'Added to cart',
      'chat.title': 'Tanya Dapur', 'chat.sub': 'The Rendang Pak Nil kitchen team', 'chat.ph': 'Ask about heating, delivery or agents…', 'chat.open': 'Tanya Dapur'
    },
    ms: {
      'nav.shop': 'Kedai', 'nav.serve': 'Cara hidang', 'nav.agent': 'Jadi agen', 'nav.where': 'Lokasi',
      'hero.marquee1': 'Warisan keluarga', 'hero.marquee2': 'Citarasa istana', 'hero.marquee3': 'Resipi keluarga, rasa istana',
      'hero.title': 'Dimasak berjam-jam. Siap dalam lima minit.',
      'hero.sub': 'Resipi Minang arwah ibu Pak Nil, dimasak perlahan sehingga pecah minyak, kemudian dibekukan. Nyahbeku, panaskan, hidang.',
      'hero.seal': 'Siap dalam 5 minit', 'hero.shop': 'Beli rendang', 'hero.shopNote': 'Dari RM28', 'hero.agent': 'Jadi agen', 'hero.agentNote': 'Agen, kenduri dan tempahan pukal',
      'tick.1': 'Resipi arwah ibu Pak Nil', 'tick.2': 'Masak hingga pecah minyak', 'tick.3': 'Siap dalam 5 minit', 'tick.4': 'Satu pek untuk 2–4 orang', 'tick.5': 'Produk keluaran Muslim', 'tick.6': 'Dapur Rumpun Selera sejak 2001',
      'trust.mihas': 'Peserta MIHAS 2026', 'trust.mihasSub': 'Booth 10B04 & 10B05, MITEC Kuala Lumpur',
      'fl.label': 'Sembilan menu', 'fl.add': 'Tambah ke troli', 'fl.serve': 'Cara hidang', 'fl.heat': 'Panaskan', 'fl.min': 'minit',
      'steps.title': 'Dari peti sejuk ke pinggan, tiga langkah.', 'steps.sub': 'Tak perlu menumbuk, tak perlu berjam-jam di dapur. Bahagian yang lama sudah siap di dapur kami.',
      'steps.seal': 'Tanpa minyak',
      'doors.kitchen': 'Untuk meja anda', 'doors.kitchenTitle': 'Pilih mana-mana tiga untuk Raya.', 'doors.kitchenBody': 'Campur rendang dan kuah ikut selera keluarga. Set tiga pek jimat 5% (cadangan tawaran).', 'doors.kitchenCta': 'Bina set Raya saya',
      'doors.biz': 'Untuk perniagaan anda', 'doors.bizTitle': 'Jual Rendang Pak Nil.', 'doors.bizBody': 'Agen, reseller, perancang kenduri dan tempahan korporat, dibekalkan dari dapur Rumpun Selera.', 'doors.bizCta': 'Mohon jadi agen',
      'mihas.title': 'Dari dapur ibunya ke MIHAS 2026.', 'mihas.body': 'September 2026, Rumpun Selera Warisan menyertai MIHAS buat kali pertama, dengan Pak Nil di pentas Pocket Talk dan pek baharu Warisan × PakNil di booth.',
      'mihas.s1': 'booth di MITEC', 'mihas.s2': 'hari MIHAS', 'mihas.s3': 'Rumpun Selera sejak', 'mihas.cta': 'Lihat pek baharu',
      'serve.title': 'Cara hidang, dari video mereka sendiri.', 'serve.all': 'Semua cara hidang',
      'rev.title': 'Kata pelanggan.', 'rev.note': 'Testimoni dari rendangpaknil.com.',
      'story.title': 'Rendang seorang ibu, bulat-bulat seperti asalnya.', 'story.nameTitle': 'Kenapa “Citarasa Istana”?', 'story.name': 'Rendang Dendeng Perak berinspirasikan resepi Istana Kuala Kangsar, Perak: warisan keluarga, citarasa istana.',
      'where.title': 'Cari Rendang Pak Nil.', 'where.kitchen': 'Dapur', 'where.online': 'Dalam talian', 'where.events': 'Acara',
      'club.title': 'Jadi yang pertama tahu stok Raya.', 'club.body': 'Sertai senarai WhatsApp dan pasukan kami akan maklumkan bila tempahan Raya dibuka. Berhenti bila-bila masa.', 'club.ph': 'Nombor WhatsApp', 'club.cta': 'Sertai senarai', 'club.done': 'Anda sudah dalam senarai. Kami akan WhatsApp bila tempahan Raya dibuka.',
      'foot.shop': 'Kedai', 'foot.serve': 'Hidang', 'foot.biz': 'Perniagaan', 'foot.company': 'Tentang', 'foot.pay': 'Bayar dengan',
      'cart.title': 'Troli anda', 'cart.empty': 'Troli anda kosong. Mulakan dengan rendang zaman kecil Pak Nil.', 'cart.free': 'Penghantaran sejuk beku percuma (Lembah Klang).', 'cart.more': 'lagi untuk penghantaran percuma di Lembah Klang', 'cart.sub': 'Jumlah kecil', 'cart.checkout': 'Bayar', 'cart.added': 'Ditambah ke troli',
      'chat.title': 'Tanya Dapur', 'chat.sub': 'Pasukan dapur Rendang Pak Nil', 'chat.ph': 'Tanya tentang cara panaskan, penghantaran atau agen…', 'chat.open': 'Tanya Dapur'
    }
  };

  return { D, C, A, products, byId, skus, extras, sku, serve, t, reviews: D.reviews };
})();

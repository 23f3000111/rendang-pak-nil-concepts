/* Rendang Pak Nil · content shared by both concepts. Edit copy and prices here, then run: node tools/sync.js
   Sources: rendangpaknil.com (pages, WooCommerce store and media library), the pack artwork, Instagram @rendangpaknil
   and Facebook /rendangpaknil (posts, reels and the MIHAS 2026 photos). Anything marked placeholder still needs the
   client's OK. Image and video paths are relative to each site's assets folder. */
(function (root) {
  'use strict';
  var P = root.PAKNIL = root.PAKNIL || {};

  P.data = {
    brand: {
      name: 'Rendang Pak Nil',
      maker: 'Rumpun Selera Enterprise',
      reg: '200103060311 (001299966-V)',
      since: 2001,
      kitchen: 'Restoran & Katering Rumpun Selera',
      partner: 'Asam Pedas London',
      face: 'Pak Nil (Datuk Aznil Hj Nawawi)',
      address: ['No 2 Jalan 2/12', 'Bandar Baru Selayang', '68100 Batu Caves, Selangor'],
      phone: '+60 11-6982 5208',
      phoneAlt: '+60 11-6097 5809',
      phoneFb: '+60 13-707 0013',
      email: 'rendangwarisanistana@gmail.com',
      geo: [3.2569, 101.6576]
    },

    links: {
      site: 'https://rendangpaknil.com',
      waNumber: '601169825208',
      whatsapp: 'https://wa.me/601169825208',
      waAlt: 'https://wa.me/601160975809',
      facebook: 'https://www.facebook.com/rendangpaknil',
      instagram: 'https://www.instagram.com/rendangpaknil',
      tiktok: 'https://www.tiktok.com/@rendangpaknil',
      maps: 'https://www.google.com/maps/search/?api=1&query=No+2+Jalan+2%2F12+Bandar+Baru+Selayang+68100+Batu+Caves',
      mapEmbed: 'https://www.google.com/maps?q=Jalan+2%2F12,+Bandar+Baru+Selayang,+68100+Batu+Caves,+Selangor&z=16&output=embed'
    },

    lines: {
      tagline: 'Warisan Keluarga, Citarasa Istana',
      taglineEn: 'Family heritage, palace taste',
      ingat: 'Ingat rendang, ingat Pak Nil!',
      ingatEn: 'Think rendang, think Pak Nil!',
      kanAda: 'Rendang Pak Nil kan ada!',
      gandingan: 'Gandingan Nostalgia Zaman-Berzaman',
      gandinganEn: 'A timeless blend of heritage & nostalgia',
      sedia: 'Sajian Sedia Dipanaskan',
      sediaEn: 'Ready-to-heat meals',
      rempah: 'Kaya rempah & pekat',
      rempahEn: 'Rich in spice, thick and glossy',
      bulat: 'Resipi arwah ibu Pak Nil, bulat-bulat',
      bulatEn: 'Pak Nil’s late mother’s recipe, kept exactly as she made it',
      story: [
        'Rendang Minang Pak Nil is not just another dish. It is a taste handed down from Pak Nil’s late mother.',
        'As a boy, Pak Nil watched her make rendang with great care: choosing the best spices, cooking it slowly until the oil separated, and making sure every mouthful was rich, thick and fragrant.',
        'To this day Pak Nil keeps her recipe exactly as it was. Every ingredient and every step still follows his mother’s recipe “bulat-bulat”, so the traditional taste lives on for a new generation.',
        'To bring this heritage to more tables at a premium standard, Pak Nil works with Asam Pedas London, the kitchen of Rumpun Selera, to produce Rendang Minang Pak Nil.',
        'For Pak Nil, rendang is not only food. It is memory, a family’s love, and a taste that brings everyone to the table.'
      ],
      storyBm: [
        'Rendang Minang Pak Nil bukan sekadar hidangan biasa, ia adalah rasa warisan yang dibawa turun-temurun daripada arwah ibu Pak Nil sendiri.',
        'Sejak kecil, Pak Nil melihat sendiri bagaimana arwah ibu menyediakan rendang dengan penuh teliti, memilih rempah terbaik, memasak perlahan-lahan sehingga pecah minyak, dan memastikan setiap suapan mempunyai rasa yang kaya, pekat dan penuh aroma.',
        'Hingga hari ini, Pak Nil masih mengekalkan resepi asal tersebut tanpa mengubah keasliannya. Setiap bahan dan cara masakan masih mengikut resepi arwah ibu Pak Nil “bulat-bulat”.',
        'Bagi mengekalkan keaslian rasa warisan ini dalam bentuk yang lebih premium dan berkualiti, Pak Nil memilih untuk berkolaborasi bersama Asam Pedas London.',
        'Bagi Pak Nil, rendang bukan hanya tentang makanan. Ia adalah kenangan, kasih sayang keluarga dan warisan rasa yang menyatukan semua di meja makan.'
      ]
    },

    stats: { menus: 9, rendangs: 6, minutes: 5, serves: '2–4', since: 2001, mihasYear: 2026, followersFb: 571 },

    products: [
      {
        id: 'minang', name: 'Rendang Minang Pak Nil', full: 'Rendang Minang Pak Nil (Daging)', short: 'Minang', tagBm: 'Resipi arwah ibu',
        en: 'Minang-style beef rendang', group: 'rendang', protein: 'beef', word: 'MINANG', badge: 'Signature', badgeBm: 'Istimewa',
        sizes: [{ g: 500, price: 48 }, { g: 1000, price: 85 }],
        line: 'Pak Nil’s late mother’s recipe: beef cooked low in Minang spices until the oil separates and the gravy turns dark, dry and glossy.',
        lineBm: 'Resipi arwah ibu Pak Nil: daging dimasak perlahan dengan rempah Minang sehingga pecah minyak, kuahnya kering dan berkilat.',
        notes: ['Rich in spice', 'Balanced heat', 'Dry, glossy gravy'], notesBm: ['Kaya rempah', 'Pedas seimbang', 'Kuah kering berkilat'],
        pairs: ['Nasi panas', 'Ketupat', 'Lemang', 'Roti jala'],
        color: { pop: '#2F6FDB', deep: '#16357A', tint: '#DCE7FA', on: '#FFFFFF', flood: '#3B7BE3', ink: '#FFFFFF' },
        warisan: ['packs/warisan-minang-480.webp', 'packs/warisan-minang-980.webp'],
        img: { pack: 'img/packs/minang.webp', sm: 'img/packs/minang-sm.webp', dish: 'img/photos/rendang-bowl.webp',
          clip: 'video/clip-minang.mp4', clipPoster: 'video/clip-minang.jpg' }
      },
      {
        id: 'dendeng', name: 'Rendang Dendeng Perak', full: 'Rendang Daging Dendeng Perak', short: 'Dendeng Perak', tagBm: 'Citarasa istana',
        en: 'Perak-style beef rendang', group: 'rendang', protein: 'beef', word: 'DENDENG', badge: 'Palace recipe', badgeBm: 'Resepi istana',
        sizes: [{ g: 1000, price: 80 }],
        line: 'Inspired by the palace recipe of Kuala Kangsar, Perak: thin slices of beef cooked down until dark and deeply spiced.',
        lineBm: 'Aspirasi resepi Istana Kuala Kangsar, Perak: hirisan daging dimasak sehingga gelap dan meresap rempah.',
        notes: ['Palace-inspired', 'Thin-sliced beef', 'Deep, dark spice'], notesBm: ['Aspirasi istana', 'Hirisan daging', 'Rempah pekat'],
        pairs: ['Nasi minyak', 'Nasi impit', 'Lemang'],
        color: { pop: '#F2B705', deep: '#1E1410', tint: '#FCEFC2', on: '#1E1410', flood: '#F2B705', ink: '#1E1410' },
        warisan: ['packs/warisan-dendeng-480.webp', 'packs/warisan-dendeng-980.webp'],
        img: { pack: 'img/packs/dendeng.webp', sm: 'img/packs/dendeng-sm.webp', dish: 'img/photos/dendeng-spices.webp',
          clip: 'video/clip-dendeng.mp4', clipPoster: 'video/clip-dendeng.jpg' }
      },
      {
        id: 'daging', name: 'Rendang Daging', full: 'Rendang Daging', short: 'Daging', tagBm: 'Klasik setiap hari',
        en: 'Beef rendang', group: 'rendang', protein: 'beef', word: 'DAGING', badge: null,
        sizes: [{ g: 500, price: 36 }, { g: 1000, price: 66 }],
        line: 'The classic: tender beef in a thick, spice-rich gravy, ready for rice, ketupat or lemang.',
        lineBm: 'Klasik: daging lembut dalam kuah rempah yang pekat, sedia untuk nasi, ketupat atau lemang.',
        notes: ['Tender beef', 'Thick gravy', 'Everyday classic'], notesBm: ['Daging lembut', 'Kuah pekat', 'Klasik harian'],
        pairs: ['Nasi panas', 'Ketupat', 'Lemang'],
        color: { pop: '#7B2FA3', deep: '#3E1352', tint: '#EBDDF3', on: '#FFFFFF', flood: '#7B2FA3', ink: '#FFFFFF' },
        img: { pack: 'img/packs/daging.webp', sm: 'img/packs/daging-sm.webp', dish: 'img/photos/rendang-daging.webp',
          clip: 'video/clip-daging.mp4', clipPoster: 'video/clip-daging.jpg' }
      },
      {
        id: 'ayam', name: 'Rendang Ayam', full: 'Rendang Ayam', short: 'Ayam', tagBm: 'Ayam meresap rempah',
        en: 'Chicken rendang', group: 'rendang', protein: 'chicken', word: 'AYAM', badge: null,
        warisan: ['packs/warisan-ayam-980.webp'],
        sizes: [{ g: 500, price: 32 }, { g: 1000, price: 60 }],
        line: 'Chicken slow-cooked in the family spice paste until the gravy clings to every piece.',
        lineBm: 'Ayam dimasak perlahan dalam rempah keluarga sehingga kuahnya melekat pada setiap ketul.',
        notes: ['Chicken pieces', 'Clinging gravy', 'Family spice paste'], notesBm: ['Ketulan ayam', 'Kuah melekat', 'Rempah keluarga'],
        pairs: ['Nasi panas', 'Nasi impit', 'Roti jala'],
        color: { pop: '#3FA535', deep: '#1F5A1C', tint: '#DDF0D6', on: '#FFFFFF', flood: '#3FA535', ink: '#FFFFFF' },
        img: { pack: 'img/packs/ayam.webp', sm: 'img/packs/ayam-sm.webp', dish: 'img/stock/chicken-rendang.webp',
          clip: 'video/clip-ayam.mp4', clipPoster: 'video/clip-ayam.jpg' }
      },
      {
        id: 'paru', name: 'Rendang Paru', full: 'Rendang Paru', short: 'Paru', tagBm: 'Kegemaran kenduri',
        en: 'Beef lung rendang', group: 'rendang', protein: 'offal', word: 'PARU', badge: null,
        sizes: [{ g: 500, price: 32 }, { g: 1000, price: 60 }],
        line: 'Beef lung, a kenduri favourite, cooked in rendang spices until tender and full of flavour.',
        lineBm: 'Paru, kegemaran kenduri, dimasak dalam rempah rendang sehingga empuk dan kaya rasa.',
        notes: ['Kenduri favourite', 'Beef lung', 'Tender and rich'], notesBm: ['Kegemaran kenduri', 'Paru lembu', 'Empuk dan kaya rasa'],
        pairs: ['Nasi panas', 'Nasi minyak'],
        color: { pop: '#F0761D', deep: '#7A3208', tint: '#FCE3CF', on: '#1E1410', flood: '#F0761D', ink: '#1E1410' },
        img: { pack: 'img/packs/paru.webp', sm: 'img/packs/paru-sm.webp', dish: 'img/stills/menu-paru.webp',
          clip: 'video/clip-paru.mp4', clipPoster: 'video/clip-paru.jpg' }
      },
      {
        id: 'ayam-special', name: 'Rendang Ayam Special', full: 'Rendang Ayam Special (hati, pedal & kaki ayam)', short: 'Ayam Special', tagBm: 'Untuk yang tahu',
        en: 'Chicken liver, gizzard & feet rendang', group: 'rendang', protein: 'offal', word: 'SPECIAL', badge: null,
        sizes: [{ g: 1000, price: 30 }],
        line: 'For those who know: chicken liver, gizzard and feet, cooked in rendang spices.',
        lineBm: 'Untuk penggemar: hati, pedal dan kaki ayam dimasak dalam rempah rendang.',
        notes: ['Liver', 'Gizzard', 'Chicken feet'], notesBm: ['Hati', 'Pedal', 'Kaki ayam'],
        pairs: ['Nasi panas', 'Nasi lemak'],
        color: { pop: '#C2297A', deep: '#5E0F3A', tint: '#F6DAE8', on: '#FFFFFF', flood: '#C2297A', ink: '#FFFFFF' },
        img: { pack: 'img/packs/ayam-special.webp', sm: 'img/packs/ayam-special-sm.webp', dish: 'video/clip-ayam-special.jpg',
          clip: 'video/clip-ayam-special.mp4', clipPoster: 'video/clip-ayam-special.jpg' }
      },
      {
        id: 'sambal', name: 'Kuah Sambal Serbaguna', full: 'Kuah Sambal Serbaguna', short: 'Sambal', tagBm: 'Pedas serbaguna',
        en: 'All-purpose sambal', group: 'kuah', protein: 'none', word: 'SAMBAL', badge: null,
        sizes: [{ g: 1000, price: 28 }],
        line: 'A ready sambal for nasi lemak, sambal telur, sambal udang or anything that needs a kick.',
        lineBm: 'Sambal sedia guna untuk nasi lemak, sambal telur, sambal udang atau apa sahaja yang perlukan rasa pedas.',
        notes: ['Ready to use', 'Bold chilli', 'Many dishes'], notesBm: ['Sedia guna', 'Cili pekat', 'Serbaguna'],
        pairs: ['Nasi lemak', 'Telur', 'Udang', 'Ikan bilis'],
        color: { pop: '#DA2A2A', deep: '#7A0C0C', tint: '#F9D9D6', on: '#FFFFFF', flood: '#DA2A2A', ink: '#FFFFFF' },
        img: { pack: 'img/packs/sambal.webp', sm: 'img/packs/sambal-sm.webp', dish: 'img/stock/sambal-bowl.webp',
          clip: 'video/clip-sambal.mp4', clipPoster: 'video/clip-sambal.jpg' }
      },
      {
        id: 'laksa', name: 'Kuah Laksa Johor', full: 'Kuah Laksa Johor', short: 'Laksa Johor', tagBm: 'Pekat, ikan segar',
        en: 'Johor laksa gravy', group: 'kuah', protein: 'fish', word: 'LAKSA', badge: null,
        sizes: [{ g: 1000, price: 30 }],
        line: 'Thick fish gravy the Johor way. Customers say it is rich and the fish tastes fresh. Serve it over spaghetti.',
        lineBm: 'Kuah laksa Johor yang pekat dengan isi ikan segar. Hidang bersama spageti atau mi laksa.',
        notes: ['Thick fish gravy', 'Fresh fish', 'Johor style'], notesBm: ['Kuah ikan pekat', 'Isi ikan segar', 'Gaya Johor'],
        pairs: ['Spageti', 'Ulam', 'Sambal belacan'],
        color: { pop: '#2B3BA6', deep: '#151C55', tint: '#DADFF5', on: '#FFFFFF', flood: '#2B3BA6', ink: '#FFFFFF' },
        img: { pack: 'img/packs/laksa.webp', sm: 'img/packs/laksa-sm.webp', dish: 'video/clip-laksa.jpg',
          clip: 'video/clip-laksa.mp4', clipPoster: 'video/clip-laksa.jpg' }
      },
      {
        id: 'kacang', name: 'Kuah Kacang', full: 'Kuah Kacang', short: 'Kuah Kacang', tagBm: 'Wajib pagi Raya',
        en: 'Peanut sauce', group: 'kuah', protein: 'none', word: 'KACANG', badge: 'Raya must-have', badgeBm: 'Wajib Raya',
        sizes: [{ g: 1000, price: 28 }],
        line: 'Raya morning is not complete without rendang and kuah kacang. Pour it over ketupat, nasi impit or satay.',
        lineBm: 'Hari raya tak lengkap tanpa rendang dan kuah kacang. Curahkan atas ketupat, nasi impit atau sate.',
        notes: ['Peanut-rich', 'Raya classic', 'For ketupat & satay'], notesBm: ['Kacang pekat', 'Klasik Raya', 'Untuk ketupat & sate'],
        pairs: ['Ketupat', 'Nasi impit', 'Sate', 'Lontong'],
        color: { pop: '#8C5A3C', deep: '#40261A', tint: '#EEDFD3', on: '#FFFFFF', flood: '#8C5A3C', ink: '#FFFFFF' },
        img: { pack: 'img/packs/kacang.webp', sm: 'img/packs/kacang-sm.webp', dish: 'img/stills/kuah-kacang-bowl.webp',
          clip: 'video/clip-kacang.mp4', clipPoster: 'video/clip-kacang.jpg' }
      }
    ],

    /* Proposed bundle (placeholder price): the client has not published bundles. */
    bundles: [
      { id: 'set-raya', name: 'Set Pagi Raya', label: 'Rendang Minang 500 g + Kuah Kacang 1 kg', price: 72, placeholder: true,
        img: 'img/packs/minang-sm.webp', contains: ['minang-500', 'kacang-1000'],
        blurb: 'Raya morning in one order: Pak Nil’s Rendang Minang and a kilo of kuah kacang for the ketupat.',
        blurbBm: 'Pagi Raya dalam satu pesanan: Rendang Minang Pak Nil dan sekilo kuah kacang untuk ketupat.' }
    ],

    claims: [
      { id: 'recipe', title: 'Arwah ibu’s recipe', bm: 'Resipi asal arwah ibu', icon: 'heart',
        short: 'Kept exactly as his mother made it.',
        long: 'Every ingredient and every step still follows Pak Nil’s late mother’s recipe “bulat-bulat”, exactly as she cooked it.' },
      { id: 'slow', title: 'Cooked until the oil splits', bm: 'Masak hingga pecah minyak', icon: 'flame',
        short: 'Slow-cooked the traditional way.',
        long: 'The rendang is cooked slowly until the oil separates (pecah minyak) and the gravy turns thick, dry and glossy. Their kitchen says the process takes a long time, on purpose.' },
      { id: 'fast', title: 'On the table in 5 minutes', bm: 'Siap dalam 5 minit', icon: 'clock',
        short: 'Thaw, heat, serve.',
        long: 'Thaw the pack, then heat it in the microwave or in a wok without any cooking oil. Their customers have it on the table in under five minutes.' },
      { id: 'frozen', title: 'Frozen at its best', bm: 'Sejuk beku, rasa terjaga', icon: 'snowflake',
        short: 'Packed and frozen after cooking.',
        long: 'Every pack is frozen after cooking and marked “Simpan sejukbeku” (keep frozen). Keep it in the freezer until you need it.' },
      { id: 'muslim', title: 'Muslim-made', bm: 'Produk keluaran Muslim', icon: 'moon',
        short: 'Produk Keluaran Muslim mark on every pack.',
        long: 'Rendang Pak Nil carries the Produk Keluaran Muslim mark and comes from the kitchen of Rumpun Selera, a restaurant and caterer since 2001.' },
      { id: 'bess', title: 'BeSS marked', bm: 'Bersih, Selamat, Sihat', icon: 'shield',
        short: 'Clean, safe and healthy.',
        long: 'Every pack carries the BeSS mark: Bersih, Selamat dan Sihat (clean, safe and healthy).' }
    ],

    marks: [
      { id: 'muslim', title: 'Produk Keluaran Muslim', sub: 'Muslim-made product' },
      { id: 'bess', title: 'BeSS', sub: 'Bersih, Selamat dan Sihat' },
      { id: 'frozen', title: 'Frozen product', sub: 'Simpan sejukbeku' },
      { id: 'since', title: 'Rumpun Selera', sub: 'Restoran & katering sejak 2001' },
      { id: 'mihas', title: 'MIHAS 2026', sub: 'Exhibitor, booth 10B04 & 10B05' }
    ],

    steps: [
      { id: 'thaw', title: 'Thaw', bm: 'Nyahbeku', text: 'Thaw the sealed pack first.', textBm: 'Nyahbeku pek terlebih dahulu.',
        img: 'img/stills/heat-thaw.webp', alt: 'A thawed pack of rendang in a steel tray, marked Defrost' },
      { id: 'heat', title: 'Heat', bm: 'Panaskan', text: 'Heat it in the microwave, or in a wok without any cooking oil.',
        textBm: 'Panaskan dalam microwave, atau dalam kuali tanpa minyak masak.',
        img: 'img/stills/heat-wok.webp', alt: 'Rendang warming in a wok, stirred with a spatula' },
      { id: 'serve', title: 'Serve', bm: 'Hidang', text: 'Serve with hot rice, ketupat, lemang or roti jala. A pack serves 2 to 4.',
        textBm: 'Hidang bersama nasi panas, ketupat, lemang atau roti jala. Satu pek untuk 2 hingga 4 orang.',
        img: 'img/stills/heat-bowl.webp', alt: 'Rendang Minang Pak Nil served in a blue and white bowl' }
    ],

    faqs: [
      { cat: 'product', q: 'What is Rendang Pak Nil?',
        a: 'Ready-to-heat frozen rendang and gravies made from Pak Nil’s late mother’s Minang recipe, produced with Rumpun Selera, the restaurant and caterer behind Asam Pedas London.' },
      { cat: 'product', q: 'Who is Pak Nil?',
        a: 'Pak Nil is Datuk Aznil Hj Nawawi. The recipe is his late mother’s, and he still keeps it exactly as she made it.' },
      { cat: 'product', q: 'Which menus are there?',
        a: 'Nine: Rendang Minang Pak Nil, Rendang Dendeng Perak, Rendang Daging, Rendang Ayam, Rendang Paru and Rendang Ayam Special, plus Kuah Sambal Serbaguna, Kuah Laksa Johor and Kuah Kacang.' },
      { cat: 'product', q: 'What is in Rendang Ayam Special?',
        a: 'Chicken liver, gizzard and feet (hati, pedal & kaki ayam) cooked in rendang spices.' },
      { cat: 'product', q: 'Is it spicy?',
        a: 'Rendang Minang is rich in spice with a balanced heat. Kuah Sambal Serbaguna is the one with the real chilli kick.' },
      { cat: 'prep', q: 'How do I prepare it?',
        a: 'Thaw the pack, then heat it in the microwave or in a wok without cooking oil. It is on the table in about five minutes.' },
      { cat: 'prep', q: 'How many people does a pack serve?',
        a: 'Their kitchen says one pack serves 2 to 4. The 1 kg packs suit bigger tables and kenduri.' },
      { cat: 'prep', q: 'How should I store it?',
        a: 'Keep it frozen (simpan sejukbeku). The best-before date is printed on every pack.' },
      { cat: 'prep', q: 'What do I serve it with?',
        a: 'Hot rice, ketupat, nasi impit, lemang or roti jala. Kuah Kacang goes over ketupat and satay, and Kuah Laksa Johor over spaghetti.' },
      { cat: 'trust', q: 'Is it halal?',
        a: 'Every pack carries the Produk Keluaran Muslim (Muslim-made) mark and the BeSS mark, and it comes from Rumpun Selera’s kitchen, a restaurant and caterer since 2001. For certificate details, ask the team on WhatsApp.' },
      { cat: 'trust', q: 'Where is it made?',
        a: 'In Rumpun Selera’s kitchen at No 2 Jalan 2/12, Bandar Baru Selayang, Batu Caves, Selangor.' },
      { cat: 'order', q: 'How do I order?',
        a: 'Add packs to your bag and send the order on WhatsApp, or message +60 11-6982 5208 directly. The team confirms the total, payment and delivery with you.' },
      { cat: 'order', q: 'Do you deliver?',
        a: 'Yes. The team confirms delivery options and the fee for your area when you order on WhatsApp.' },
      { cat: 'order', q: 'Where else can I buy it?',
        a: 'At rendangpaknil.com, on WhatsApp, at Asam Pedas London, and at events such as MIHAS 2026, where Rumpun Selera Warisan exhibited for the first time.' },
      { cat: 'business', q: 'Can I become an agent?',
        a: 'Yes. Rumpun Selera is looking for agents. Fill in the agent form or WhatsApp +60 11-6982 5208 and the team will explain the agent prices.' },
      { cat: 'business', q: 'Do you take kenduri and corporate orders?',
        a: 'Yes. Rumpun Selera has been a restaurant and caterer since 2001, and the 1 kg packs are made for big tables. Tell the team your date and headcount.' },
      { cat: 'business', q: 'What is Warisan × PakNil?',
        a: 'The new look for the range, shown at MIHAS 2026: Rumpun Selera Warisan × PakNil, “Gandingan Nostalgia Zaman-Berzaman”, in woven pouches of 480 g and 980 g.' }
    ],

    quiz: [
      { q: 'Daging, ayam or the good bits?', qBm: 'Daging, ayam atau yang istimewa?', options: [
        { label: 'Daging all the way', sub: 'Beef, please', score: { minang: 2, daging: 2, dendeng: 2 } },
        { label: 'Ayam for me', sub: 'Chicken, please', score: { ayam: 3, 'ayam-special': 1 } },
        { label: 'The bits others skip', sub: 'Paru, hati, pedal', score: { paru: 3, 'ayam-special': 3 } } ] },
      { q: 'When is it going on the table?', qBm: 'Bila nak hidang?', options: [
        { label: 'Raya morning', sub: 'With ketupat', score: { minang: 2, dendeng: 1 } },
        { label: 'Lunchbox or after work', sub: 'Quick and easy', score: { ayam: 2, daging: 2 } },
        { label: 'A kenduri', sub: 'Feeding a crowd', score: { paru: 2, dendeng: 1, 'ayam-special': 1 } } ] },
      { q: 'Pick a vibe', qBm: 'Pilih gaya', options: [
        { label: 'Royal and refined', sub: 'Citarasa istana', score: { dendeng: 3 } },
        { label: 'Just like Mak’s', sub: 'Masakan ibu', score: { minang: 3 } },
        { label: 'Simple and classic', sub: 'Everyday rendang', score: { daging: 2, ayam: 1 } } ] }
    ],

    moments: [
      { id: 'raya', when: 'Raya morning', whenBm: 'Pagi Raya', title: 'Ketupat, rendang, kuah kacang', pair: 'minang', pair2: 'kacang',
        text: 'Raya morning is not complete without rendang and kuah kacang. Heat both while the ketupat is cut.',
        img: 'img/stills/kuah-kacang-bowl.webp', video: 'video/reel-raya.mp4' },
      { id: 'bekal', when: 'Lunch time', whenBm: 'Waktu bekal', title: 'A lunchbox worth opening', pair: 'minang',
        text: 'Heat a few spoonfuls in the morning, pack it with rice, and the kids (and the parents) eat well.',
        img: 'img/stills/bekal.webp', video: 'video/reel-bekal.mp4' },
      { id: 'dinner', when: 'Dinner after work', whenBm: 'Balik kerja', title: 'Rendang in under five minutes', pair: 'daging',
        text: 'Home late and craving rendang? Thaw in the morning, heat at night, and it is on the table before the rice is scooped.',
        img: 'img/stills/busy-mum.webp', video: 'video/reel-busy.mp4' },
      { id: 'camping', when: 'Weekend camping', whenBm: 'Hujung minggu', title: 'Hot rendang by the river', pair: 'minang',
        text: 'Bring a pack to the campsite, warm it in the pan, and eat it with hot rice by the river.',
        img: 'img/stills/camping-river.webp', video: 'video/reel-river.mp4' },
      { id: 'guests', when: 'When guests drop by', whenBm: 'Tetamu datang', title: 'Saved when guests turn up', pair: 'minang',
        text: '“Rendang Minang saves time when guests turn up unexpectedly, and it still tastes great even though it is frozen.” Puan Natasha',
        img: 'img/stills/spread-table.webp', video: 'video/reel-spread.mp4' }
    ],

    reviews: [
      { name: 'Acik Beqal', product: 'minang', stars: 5,
        bm: 'Senin aritu masa pergi makan di @asampedaslondon sempat beli dah.. alhamdulillah sedapp .. tak kedekut rempahnya..',
        en: 'Bought some while eating at Asam Pedas London. Delicious, and they don’t skimp on the spices.' },
      { name: 'Haiza Hanafi', product: 'minang', stars: 5,
        bm: 'Semalam makan last packet..loveeee..nanti order lagi',
        en: 'Finished my last pack yesterday. Love it, ordering again.' },
      { name: 'Puan Natasha', product: 'minang', stars: 5,
        bm: 'Senang gila nak prepare. Rendang Minang ni save time bila tetamu datang mengejut. Rasa tetap mantap walaupun frozen.',
        en: 'So easy to prepare. Rendang Minang saves time when guests turn up unexpectedly, and it still tastes great even though it’s frozen.' },
      { name: 'Cik Azreen', product: 'laksa', stars: 5,
        bm: 'Kuah Laksa Johor dia sangat pekat dan rasa ikan sangat fresh. Susah nak cari yang sedia dimakan sesedap macam ni.',
        en: 'The Kuah Laksa Johor is really thick and the fish tastes fresh. Hard to find a ready-to-eat one this good.' },
      { name: 'Puan Aishah', product: 'laksa', stars: 5,
        bm: 'Yg penting kuah laksa johor sedap, mudah kn kerja memasak.. hanya panas kan ajer siap…pekat kuahnya…terasa isi ikan segar dlmnya..yg penting mmg sedap lah',
        en: 'The Kuah Laksa Johor is delicious and makes cooking easy: just heat it and it’s done. Thick gravy with fresh fish in it.' }
    ],

    mihas: {
      name: 'MIHAS 2026', full: 'Malaysia International Halal Showcase', dates: '23–26 September 2026',
      venue: 'MITEC, Kuala Lumpur', booth: '10B04 & 10B05', hall: 'Exhibition Hall, Level 3', geo: [3.179, 101.6678],
      note: 'Rumpun Selera Warisan’s first time at MIHAS, with Pocket Talk Pak Nil on stage and Chef Alwi dropping by the booth.'
    },

    agent: {
      fits: ['Resellers and dropshippers', 'Office and community buyers', 'Kedai runcit and frozen-food shops', 'Kenduri and catering planners'],
      fitsBm: ['Reseller dan dropship', 'Pembeli pejabat dan komuniti', 'Kedai runcit dan kedai sejuk beku', 'Perancang kenduri dan katering'],
      /* who the agent call-out is for; terms are not published, so no prices or commission here */
      roles: [
        { id: 'reseller', title: 'Resellers and dropshippers', bm: 'Reseller & dropship', icon: 'message',
          text: 'Sell to your own WhatsApp groups and followers. You order frozen packs from the kitchen and deliver them in your area; the team explains the agent prices.',
          img: 'img/photos/range-paknil.webp' },
        { id: 'kedai', title: 'Kedai runcit and frozen-food shops', bm: 'Kedai & kedai sejuk beku', icon: 'store',
          text: 'Give Rendang Pak Nil a shelf in your freezer. Nine menus in 500 g and 1 kg packs, with Pak Nil on the front.',
          img: 'img/photos/paknil-range.webp' },
        { id: 'office', title: 'Office and community buyers', bm: 'Pejabat & komuniti', icon: 'users',
          text: 'Collect orders at work, at the surau or in your taman, and take one delivery for everyone before Raya.',
          img: 'img/stills/spread-table.webp' },
        { id: 'kenduri', title: 'Kenduri and catering planners', bm: 'Kenduri & katering', icon: 'utensils',
          text: 'The 1 kg packs are made for big tables. Rumpun Selera has catered since 2001: tell the team your date and headcount.',
          img: 'img/stills/spread-bowls.webp' }
      ]
    },

    media: {
      reels: [
        { id: 'raya', src: 'video/reel-raya.mp4', poster: 'video/reel-raya.jpg', title: 'Raya morning: rendang and kuah kacang' },
        { id: 'heat', src: 'video/reel-heat.mp4', poster: 'video/reel-heat.jpg', title: 'From freezer to bowl' },
        { id: 'make', src: 'video/reel-make.mp4', poster: 'video/reel-make.jpg', title: 'How Rendang Pak Nil is made' },
        { id: 'paknil', src: 'video/reel-paknil.mp4', poster: 'video/reel-paknil.jpg', title: 'Pak Nil at the table' },
        { id: 'river', src: 'video/reel-river.mp4', poster: 'video/reel-river.jpg', title: 'Camping by the river' },
        { id: 'bekal', src: 'video/reel-bekal.mp4', poster: 'video/reel-bekal.jpg', title: 'A lunchbox worth opening' },
        { id: 'busy', src: 'video/reel-busy.mp4', poster: 'video/reel-busy.jpg', title: 'Rendang after a long day' },
        { id: 'spread', src: 'video/reel-spread.mp4', poster: 'video/reel-spread.jpg', title: 'Daging or ayam?' },
        { id: 'menu', src: 'video/reel-menu.mp4', poster: 'video/reel-menu.jpg', title: 'All nine on the table' },
        { id: 'beauty', src: 'video/reel-beauty.mp4', poster: 'video/reel-beauty.jpg', title: 'Kaya rempah & pekat' },
        { id: 'cook', src: 'video/reel-cook.mp4', poster: 'video/reel-cook.jpg', title: 'Semudah itu' },
        { id: 'camping', src: 'video/reel-camping.mp4', poster: 'video/reel-camping.jpg', title: 'Camping night: defrost, heat, eat' },
        { id: 'mihas', src: 'video/reel-mihas.mp4', poster: 'video/reel-mihas.jpg', title: 'Pak Nil arrives at MIHAS 2026' }
      ],
      mihasPhotos: [
        { src: 'img/photos/mihas-selfie.webp', alt: 'Pak Nil takes a selfie with a packed crowd at the MIHAS 2026 Pocket Talk' },
        { src: 'img/photos/mihas-talk-products.webp', alt: 'Pak Nil on the Pocket Talk stage at MITEC with Rendang Pak Nil packs on the table' },
        { src: 'img/photos/mihas-standee.webp', alt: 'Pak Nil gives a thumbs up next to his life-size standee at the Warisan x PakNil booth' },
        { src: 'img/photos/mihas-signing.webp', alt: 'Pak Nil signs “i RENDANG you very much” tote bags at the booth' },
        { src: 'img/photos/mihas-totes.webp', alt: 'Two visitors with yellow “i RENDANG you very much” tote bags at MIHAS 2026' },
        { src: 'img/photos/mihas-booth-guests.webp', alt: 'Guests pose with Warisan x PakNil props in front of the maroon booth wall' },
        { src: 'img/photos/mihas-booth.webp', alt: 'Two women hold Warisan x PakNil props at the booth' },
        { src: 'img/photos/mihas-crowd.webp', alt: 'Pak Nil speaks to a seated audience at the MITEC exhibition hall' }
      ],
      instagram: [
        { href: 'https://www.instagram.com/rendangpaknil/reel/DZbl5tIpzka/', img: 'video/reel-river.jpg', alt: 'Camping by the river with Rendang Pak Nil' },
        { href: 'https://www.instagram.com/rendangpaknil/reel/DZZFiCzJlpf/', img: 'video/reel-bekal.jpg', alt: 'A school lunchbox with rendang and rice' },
        { href: 'https://www.instagram.com/rendangpaknil/reel/DZTuS4yJi7q/', img: 'video/reel-busy.jpg', alt: 'A busy mum heats rendang after work' },
        { href: 'https://www.instagram.com/rendangpaknil/p/DY8vBAwifO7/', img: 'img/photos/rendang-bowl.webp', alt: 'Rendang in a blue and white bowl with chillies and shallots' },
        { href: 'https://www.instagram.com/rendangpaknil/reel/DY6PtcIp98j/', img: 'video/reel-beauty.jpg', alt: 'Rendang Minang Pak Nil pack among fresh spices' },
        { href: 'https://www.instagram.com/rendangpaknil/reel/DYwJZ_aJsPx/', img: 'video/reel-spread.jpg', alt: 'A table spread of rendang dishes on batik' }
      ]
    }
  };
}(typeof window !== 'undefined' ? window : globalThis));

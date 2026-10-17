# Concept B: Ingat Rendang, Ingat Pak Nil!

A playful Raya-pop site for Rendang Pak Nil, built like ABIN's Kali Nak Lagi! site: a banana-leaf green canvas with a ketupat weave, cartoon outlines and hard shadows, the black pouches with their bright labels, Pak Nil waving from the hero and real spices falling through it. Open `index.html` (or the chooser one folder up).

Tuned for desktop and laptop screens.

## Pages

| Page | What is on it |
|---|---|
| `index.html` | Spice-rain hero with Pak Nil and four packs, two marquees, the pinned "Pilih rendang anda" scene for the six rendangs, six promises as ketupat badges, numbers, four featured packs, "Bila-bila masa" moments with a five-minute microwave timer, their reels, a rendang quiz, MIHAS 2026, kenduri card, agent roles, reviews, Instagram |
| `shop.html` | Filters (rendang, kuah, beef, chicken, paru and the special bits, 500 g, 1 kg, Raya set), sort, ten cards with quick view, buying for a kenduri or a shop, how ordering works |
| `product.html?p=minang&s=500` | One template for all nine menus: pack and outline word, sizes, quantity, add to bag, ask on WhatsApp, the new Warisan pouch where there is one, taste notes, what to serve it with, the menu's clip, pack facts, the three heating steps, other menus, next menu |
| `about.html` | Pak Nil's mother's recipe, what the kitchen holds on to, Rumpun Selera's kitchen, from Selayang to MIHAS, the marks on every pack, numbers |
| `why.html` | Six promises as tabs, from the kawah to your freezer in four steps, time at the stove, kitchen questions |
| `faq.html` | Search and topics across 17 answers |
| `contact.html` | WhatsApp, call, e-mail and visit cards; forms for hello, agents, and kenduri and bulk orders (with a pack estimate); map and socials |

## Try this in a demo

1. First visit: the "Memanaskan kuali…" loader, then the hero. Hover or tap a falling chilli, star anise or garlic: a stone pestle pounds it (the speaker button in the header mutes the thud).
2. Click a pack in the hero for a quick view, switch to 1 kg, then "Add to bag". The pack flies into the bag.
3. Scroll through "Pilih rendang anda": the page takes each pack's colour.
4. Keep scrolling to "Bila-bila masa": the microwave timer counts down to "SIAP!". Tap a moment to watch its reel.
5. Tap Tupat, the ketupat in the bottom corner, for kitchen tips; take the "Rendang mana satu awak?" quiz.
6. Open the bag, add a name and area, and press "Order on WhatsApp": the order arrives as a ready-made message.
7. On the shop page, try "1 kg" and "Price, low to high". `shop.html#set-raya` opens the Raya set's quick view directly.
8. On the contact page, open "Kenduri and bulk orders" and type 300 guests: the form estimates the 1 kg packs, then opens WhatsApp with the enquiry.

## Editing

- Copy, prices and facts: `../shared/js/data.js`, then `node tools/sync.js` from the project root.
- Page markup: `../src/site-b/` (layout, partials, pages), then `node tools/pages.js`. The `.html` files in this folder are generated; edit `src/` instead.
- Styles: `assets/css/base.css` (tokens, type, buttons), `chrome.css` (header, menu, footer, pop-ups, bag, mascot), `pages.css` (sections).
- Motion: `assets/js/fx.js` (loader, page transitions, reveals, sounds, Tupat), `rempah.js` (spice rain), `scenes.js` (rendang scene, timer, inner-page moments). Shared behaviour is in `ui.js`, `shop.js` and `forms.js`.

## Placeholders

See `CREDITS.md`. In short: the Set Pagi Raya and its RM72 price, delivery fees (left to the team), agent terms, portion size for the 1 kg packs, prices of the new Warisan pouches, and Tupat the mascot.

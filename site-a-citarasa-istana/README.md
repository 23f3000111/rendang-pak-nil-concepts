# Concept A: Citarasa Istana

A heritage flagship store for Rendang Pak Nil, built like the Kantan flagship site: the new Warisan × PakNil maroon and gold, arched windows on the food photos, and a calm frame that lets the colourful packs and plates do the talking. Open `index.html` (or the chooser one folder up).

Tuned for desktop and laptop screens.

## Pages

| Page | What is on it |
|---|---|
| `index.html` | Italic marquee hero with an arched rendang photo and the new Warisan pouch, trust row, the nine menus flooding the screen one by one, freezer to plate in three steps, Raya set and agent doors, MIHAS 2026, the new look, serving ideas, reviews, Pak Nil's mother's story, where to buy (map), Raya pre-order list |
| `shop.html` | Filters (rendang or kuah, daging, ayam, the special bits, 1 kg packs), the nine menus with size switches, a Raya set builder, kenduri and gift boxes, a monthly freezer stock-up |
| `product.html?p=minang&s=500` | One template for all nine menus: sizes, quantity, add to cart, facts at a glance, the menu's clip from their reel, serving idea, reviews, a nudge to the 1 kg packs for kenduri, sticky add-to-cart |
| `serve.html` | Nine serving ideas from their own videos, filters, and a big step-by-step serve mode |
| `agent.html` | Who the agent programme is for, a five-step agent application, kenduri calculator, how it is made, MIHAS photos and booth QR code, tasting booking, FAQ |
| `portal.html` | Agent portal demo with sample data: sign in, order again with live totals, agent price tiers, orders and invoices, marketing kit |

Every page has the EN/BM switch, the slide-out cart and Tanya Dapur, the kitchen chat helper.

## Try this in a demo

1. Switch to BM in the header, then back to EN.
2. Scroll the home page through the nine menus: the screen floods with each pack's colour and plays its clip.
3. Add a pack to the cart and watch the free-delivery bar; check out with DuitNow QR (the demo confirms itself after a few seconds).
4. On the shop page, build a Raya set: pick any three packs and see the set price.
5. Open Tanya Dapur and ask "how do I heat it?", "is it halal?" or "I want to be an agent".
6. On "Become an agent", go through the five steps: the application opens in WhatsApp, ready to send.
7. Try the kenduri calculator with 300 guests.
8. Sign in to the agent portal (the demo account is filled in) and change the reorder quantities.

## Editing

- Copy, prices and facts: `../shared/js/data.js`, then `node tools/sync.js` from the project root. Concept A's own strings (EN/BM interface text, serving ideas, cart extras) are in `assets/js/site-data.js`.
- Pages are hand-written `.html` files in this folder; `assets/js/site.js` adds the header, footer, cart and checkout to every page.
- Styles: `assets/css/site.css`. Page behaviour: `home.js`, `shop.js`, `product.js`, `serve.js`, `agent.js`, `portal.js`, plus `chat.js` for Tanya Dapur.

## Placeholders

See `CREDITS.md`. In short: the proposed offers (Raya set 5% off, freezer stock-up 10% off, kenduri and gift boxes), delivery threshold and fee, agent tiers and all portal data, the demo checkout, prices of the new Warisan pouches, and Tanya Dapur itself.

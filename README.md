# Rendang Pak Nil: two website concepts

Two alternative websites for Rendang Pak Nil (Rumpun Selera Enterprise, Batu Caves), so the client can pick a direction. Both use the same real content from rendangpaknil.com, the packs, Instagram and Facebook, and differ in look, motion and personality.

This round is tuned for desktop and laptop screens (1280 to 1920 px wide). Phone layouts work and were spot-checked at 390 px; a full phone pass follows once a concept is chosen.

## Live

- **Chooser (both concepts):** <https://23f3000111.github.io/rendang-pak-nil-concepts/>
- **Concept A, Citarasa Istana:** <https://23f3000111.github.io/rendang-pak-nil-concepts/site-a-citarasa-istana/>
- **Concept B, Ingat Rendang, Ingat Pak Nil!:** <https://23f3000111.github.io/rendang-pak-nil-concepts/site-b-ingat-rendang/>

## Open it locally

- Double-click `index.html` in this folder. It is a chooser page that links to both concepts.
- Or open a concept directly: `site-a-citarasa-istana/index.html` and `site-b-ingat-rendang/index.html`.
- Everything is local, including fonts and videos, so the sites work offline and straight from disk. Only the maps (OpenStreetMap in A, Google Maps in B) and the outbound links (WhatsApp, Facebook, Instagram, TikTok) need the internet. No build step.
- For the smoothest result in a meeting, serve the folder instead: `python -m http.server 8811`, then open <http://127.0.0.1:8811/>.

## The two concepts

| | Concept A: Citarasa Istana | Concept B: Ingat Rendang, Ingat Pak Nil! |
|---|---|---|
| Modelled on | Kantan flagship (the store, without that pitch's demo bar and feature tour) | ABIN site A, Kali Nak Lagi! |
| Feel | Heritage flagship store: the new Warisan × PakNil maroon and gold, arched windows on the food, a calm frame | Raya-pop: cartoon outlines and hard shadows, a ketupat-weave canvas, loud and joyful |
| Palette | Kertas cream, Istana maroon, gold, cili red, daun green | Banana-leaf green, kuali black, chilli red, turmeric yellow, ketupat green, lada maroon |
| Type | Fraunces (headings), Anybody condensed (names, prices), Hanken Grotesk (text) | Ultra (fat slab, like the pack lettering), Figtree (text), Caveat Brush (notes) |
| Hero | Italic marquee, an arched photo of their rendang with the new Warisan pouch, "Slow-cooked for hours. Ready in five minutes." | "Ingat rendang, ingat Pak Nil!" with Pak Nil waving over four packs while real spices fall; tap one and a stone pestle pounds it |
| Signature scroll | All nine menus flood the screen one by one in their pack colours, each with its clip from their reel | A pinned "Pilih rendang anda" scene for the six rendangs, and a microwave timer that counts down five minutes as you scroll |
| Extras | EN/BM switch, slide-out cart with free-delivery bar and a demo DuitNow checkout, Raya set builder, serving ideas with serve mode, five-step agent application, kenduri calculator, agent portal (sample data), Tanya Dapur chat | Loader ("Memanaskan kuali…"), circle-wipe page transitions, Tupat the ketupat mascot with tips, a rendang quiz, MIHAS photo fan, kenduri card, agent roles, kitchen sounds you can mute |
| Pages | Home, Shop, Product, Serving ideas, Become an agent, Agent portal | Home, Shop, Product, Our story, Why Pak Nil, FAQ, Contact |
| Folder | `site-a-citarasa-istana/` | `site-b-ingat-rendang/` |

The product page is one template in both: `product.html?p=minang&s=500`, with `p` = minang, dendeng, daging, ayam, paru, ayam-special, sambal, laksa or kacang and `s` = 500 or 1000 where that size exists. Orders, agent applications and kenduri enquiries end in a ready-made WhatsApp message (or an e-mail) that the visitor sends themselves. A's checkout is a demo that confirms itself; nothing is charged or posted anywhere.

## What is real

- The nine menus, their sizes and prices: Minang 500 g RM48 and 1 kg RM85, Dendeng Perak 1 kg RM80, Daging RM36 / RM66, Ayam RM32 / RM60, Paru RM32 / RM60, Ayam Special 1 kg RM30, Sambal Serbaguna 1 kg RM28, Laksa Johor 1 kg RM30, Kuah Kacang 1 kg RM28 (rendangpaknil.com store).
- Pak Nil's late mother's recipe story, "Warisan keluarga, citarasa istana", "Ingat rendang, ingat Pak Nil!" and the other lines, in their words.
- The pack facts: keep frozen, thaw then heat in the microwave or a wok without oil, the Produk Keluaran Muslim and BeSS marks. There is no JAKIM logo on the packs, so neither site claims halal certification; the FAQ answers with the marks and points to WhatsApp for certificate details.
- Rumpun Selera Enterprise (200103060311), restaurant and caterer since 2001, behind Asam Pedas London; the Selayang address, phone, WhatsApp, e-mail and social accounts.
- The five customer reviews from the website, MIHAS 2026 (23–26 September, MITEC, booth 10B04 & 10B05), the new Warisan × PakNil pouches, and their own photos and reels.

## Placeholders to confirm

- Proposed offers: A's Raya set (any three packs, 5% off), freezer stock-up (10% off) and kenduri and gift boxes; B's Set Pagi Raya at RM72. Both sites flag these as proposals.
- Delivery: A's free frozen delivery above RM150 in the Klang Valley and RM15 below are proposals; B leaves the fee to the team on WhatsApp.
- Agent terms: none are published. A's portal tiers (10/15/20% off) and the sample agent "Kedai Mak Teh" are sample data; both sites say the team explains agent prices.
- Prices and photos of the new 480 g and 980 g Warisan pouches (shown as the new look, without prices).
- Portion size for the 1 kg packs: the brand says one pack serves 2 to 4; the kenduri estimates assume a 1 kg pack serves 4 to 8.
- Tanya Dapur (A's chat) and Tupat the ketupat (B's mascot) are proposals, not existing brand characters. The chat never speaks as Pak Nil.
- WhatsApp orders go to +60 11-6982 5208 (website and pack); the Instagram order line +60 11-6097 5809 and the Facebook number +60 13-707 0013 are listed as alternatives.

Each concept's `README.md` has a click-through demo script, and its `CREDITS.md` lists every image source. Every judgement call is logged in `docs/superpowers/rulings/2026-10-16-pak-nil-two-sites.md`.

## Folder map

```
index.html                 chooser page: start here
assets/                    chooser previews, badge and favicon
site-a-citarasa-istana/    Concept A, ready to open (hand-written pages; js/site.js adds the header, footer and cart)
site-b-ingat-rendang/      Concept B, ready to open (pages built from src/site-b)
src/site-b/                Concept B page sources: layout, partials and page bodies
shared/js/                 content (data.js), cart and message logic (core.js), GSAP, ScrollTrigger, SplitText, Lenis
tools/                     page builder, shared-script sync, asset pipeline, font downloader
tests/                     automated checks for content, logic and pages
docs/superpowers/          design spec, build plan and decisions log
source-assets/             raw downloads from the website, Instagram, Facebook and Unsplash (not published)
```

## Commands

Run from this folder.

```
node tools/pages.js        rebuild Concept B's pages from src/site-b (run after editing src/)
node tools/sync.js         copy shared/js into both sites (run after editing shared/js)
node --test tests/         check content, cart maths, messages and every page's references
python tools/assets.py     regenerate images and video from source-assets/
python tools/fonts.py      re-download the self-hosted fonts
```

`tools/assets.py` needs Python 3 with Pillow, NumPy, OpenCV and rembg, plus ffmpeg on the path. Pass section names to run only part of it, for example `python tools/assets.py packs spices`. It writes a few more images than the pages use; unused ones were removed from the site folders.

Ready for GitHub Pages: `.nojekyll` is included, and `.gitignore` keeps `source-assets/` out of the repository.

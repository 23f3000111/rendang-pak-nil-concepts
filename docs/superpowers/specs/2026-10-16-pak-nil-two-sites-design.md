# Rendang Pak Nil: two website concepts — design spec

Date: 2026-10-16 · Status: built on the user's request ("make one site like the Kantan flagship and another like ABIN site A"); every judgement call is logged in `docs/superpowers/rulings/2026-10-16-pak-nil-two-sites.md`.

## 1. Goal

Two complete, alternative websites for **Rendang Pak Nil** (Rumpun Selera Enterprise, Batu Caves), so the client can pick a direction:

- **Concept A, "Citarasa Istana"** — a flagship online store built like `Kantan/flagship` (same page set and feature set, without the demo bar and feature tour that belonged to the Kantan pitch: EN/BM toggle, slide-out cart with demo payment, pinned colour showcase, serving videos, business page with a step-by-step form, trade portal, scripted chat, map).
- **Concept B, "Ingat Rendang, Ingat Pak Nil!"** — a playful seven-page site built like `abin_snackfood/site-a-kali-nak-lagi` (same page set and motion vocabulary: loader, page wipes, a tap-to-play signature toy, pinned flavour scene, mascot with tips, quiz, reels, WhatsApp bag).

Both use the same real content. They differ in look, motion and personality. Standing preferences from the user's earlier pitches apply: vibrant colour, no dark theme, products big and uncluttered, desktop sizes (1280–1920) verified first.

## 2. Verified content (single source: `shared/js/data.js`)

Sources: rendangpaknil.com (pages + WooCommerce Store API + media library), Instagram @rendangpaknil (12 public posts), Facebook /rendangpaknil (photos, reels, MIHAS 2026 posts), the pack artwork.

**Company.** RUMPUN SELERA ENTERPRISE (200103060311 (001299966-V)), "Restoran & Katering Rumpun Selera, sejak 2001", maker of Asam Pedas London. No 2 Jalan 2/12, Bandar Baru Selayang, 68100 Batu Caves, Selangor. WhatsApp/phone +60 11-6982 5208 (site, pack), IG order line +60 11-6097 5809, FB +60 13-707 0013. rendangwarisanistana@gmail.com. Socials: facebook.com/rendangpaknil, instagram.com/rendangpaknil, tiktok.com/@rendangpaknil (link only; TikTok is blocked in India).

**Face of the brand.** Pak Nil (Datuk Aznil Hj Nawawi). The site never speaks as him: the chat assistant is "Tanya Dapur" (ask the kitchen).

**Story (their words, translated).** The recipe is Pak Nil's late mother's Minang rendang, kept "bulat-bulat" (exactly as she made it): the best spices, cooked slowly until the oil separates (pecah minyak), rich, thick and fragrant. Pak Nil partnered with Asam Pedas London to produce it at premium quality. Rendang Perak is inspired by the palace recipe of Kuala Kangsar, Perak. "Warisan Keluarga, Citarasa Istana" (family heritage, palace taste).

**New identity (Oct 2026).** "Rumpun Selera Warisan × PakNil — Gandingan Nostalgia Zaman-Berzaman / A timeless blend of heritage & nostalgia": maroon-and-gold scalloped badge; woven kraft pouches with an arched window; "Sajian Sedia Dipanaskan / Ready-to-heat meals". Mockups: Rendang Daging Minang (480 g, 980 g), Rendang Daging Dendeng Perak (480 g, 980 g), Rendang Ayam (980 g). First shown at **MIHAS 2026** (23–26 Sep, MITEC KL, booth 10B04 & 10B05, hall level 3; "Pocket Talk Pak Nil"; Chef Alwi visited).

**Range and prices (Store API, all frozen, "Sejuk Beku").**

| id | Product | Sizes and prices |
|---|---|---|
| minang | Rendang Minang Pak Nil (Daging) | 500 g RM48 · 1 kg RM85 |
| dendeng | Rendang Dendeng Perak | 1 kg RM80 |
| daging | Rendang Daging | 500 g RM36 · 1 kg RM66 |
| ayam | Rendang Ayam | 500 g RM32 · 1 kg RM60 |
| paru | Rendang Paru | 500 g RM32 · 1 kg RM60 |
| ayam-special | Rendang Ayam Special (hati, pedal & kaki ayam) | 1 kg RM30 |
| sambal | Kuah Sambal Serbaguna | 1 kg RM28 |
| laksa | Kuah Laksa Johor | 1 kg RM30 |
| kacang | Kuah Kacang | 1 kg RM28 |

**Pack facts.** "Simpan sejukbeku" (keep frozen). Preparation printed on the pack: thaw, then heat in the microwave, or heat in a wok without cooking oil. Marks: Produk Keluaran Muslim, BeSS (Bersih, Selamat dan Sihat), Frozen Product. **No JAKIM halal logo appears anywhere, so the sites never claim halal certification.** Their captions: one pack serves 2–4; on the table in under 5 minutes; slow-cooked process "takes a long time".

**Reviews (real, from the site).** Acik Beqal, Haiza Hanafi, Puan Natasha, Cik Azreen, Puan Aishah (quotes kept in BM with an English line).

**Placeholders (flagged in READMEs and on the page where prices are concerned).** Bundle and gift prices, delivery terms and fees, agent tiers/commission, portal data, order numbers, the A demo checkout, the 480/980 g prices of the new packs, B's mascot "Tupat".

## 3. Assets (tools/assets.py, outputs WebP/MP4 into each site)

- Packs: the nine transparent pack renders (1707×2560) trimmed → `packs/<id>.webp` (1100 px tall) and `-sm` (560 px). New Warisan mockups trimmed the same way.
- Logo: Warisan × PakNil badge (834 px, white background removed) for A; B uses a typeset wordmark (proposal) plus the badge in the footer.
- Photos: site banners, rendang plating shots, IG carousel, FB MIHAS photos, a cut-out of Pak Nil waving (rembg) and Unsplash photos (listed in CREDITS) for dishes the client has not photographed (chicken rendang, sambal, satay with kuah kacang, ketupat).
- Video: their reels re-encoded for the web (H.264, faststart, posters): the heat-and-serve reel (thaw → wok → bowl), the production reel, the product-by-product reel (cut into per-product clips), camping, lunchbox, Raya, Pak Nil eating rendang.
- Spice sprites for B: chilli, star anise, cinnamon, garlic, shallot, lime leaf, coconut (Unsplash isolates, rembg).
- Fonts self-hosted (woff2). Icons inline SVG (Lucide style; brand marks from Simple Icons).

## 4. Concept A — "Citarasa Istana" (Kantan flagship structure)

**Feel.** The new Warisan identity: maroon and gold songket, brass and banana leaf, a calm editorial frame that lets the colourful packs and food photos shout.

**Tokens.** Canvas "kertas emas" #F7ECD8, kraft #EAD6B4, Istana maroon #5C0F1F (ink and flood sections), gold #D4AA5A (ornaments), cili red #C8102E (actions), daun green #1F5135, kunyit #E9A93A. Type: Fraunces (display serif + italic marquee), Anybody condensed (product names, prices, numbers — the current site's heading face), Hanken Grotesk (body, the current site's body face). Motif: the Warisan arch (scalloped badge) replaces Kantan's bloom — seals, map pins, arched photo windows; star anise as the marquee ornament; one songket "pucuk rebung" strip under the header.

**Pages** (`site-a-citarasa-istana/`): `index.html` home · `shop.html` · `product.html?p=minang&s=500` · `serve.html` (Cara hidang: serving ideas + their videos; Kantan's recipes page) · `agent.html` (For business: agents, kenduri & corporate bulk, MIHAS; Kantan's OEM page with a 5-step application) · `portal.html` (agent portal with sample data; Kantan's wholesale page).

**Home.** Header (Shop, Cara hidang, Jadi agen | badge logo | Where to buy, EN/BM, cart) · hero (italic marquee "Warisan keluarga ✦ Citarasa istana", arched rendang photo with "Siap 5 minit" seal and the new Minang pack, panel "Slow-cooked for hours. Ready in five minutes.", two doors, claims ticker) · trust row · **pinned showcase: nine menus, each floods the screen in its pack colour** · from freezer to plate (thaw, heat, serve with stills from their reel; numbered because it is a sequence) · doors (Raya set builder / agents) · MIHAS 2026 feature · Cara hidang cards with video · reviews · story (Kisah warisan + Pak Nil photos + "Why Citarasa Istana?") · where to buy map · Raya pre-order list · footer.

**Shared behaviour.** EN/BM strings, cart drawer with free-delivery bar (threshold is a placeholder), demo checkout (DuitNow QR, FPX, cards; confirms itself), Tanya Dapur chat (heating, halal question answered honestly, delivery, order tracking, agent sign-up flow), toasts, modals, Lenis + GSAP, reduced motion respected.

## 5. Concept B — "Ingat Rendang, Ingat Pak Nil!" (ABIN site A structure)

**Feel.** Raya-pop: loud, joyful, cartoon outlines with hard shadows, stickers and wavy edges, the black pouches with their vivid labels, falling spices.

**Tokens.** Canvas pale daun-pisang green #EEF3D6, kuali-black ink #1E1410, cili red #E3262E, kunyit #FFB51F, ketupat green #2E8B3D, lada maroon #7C0C1B; each product's label colour (Minang sky blue, Dendeng gold, Daging purple, Ayam green, Paru orange, Ayam Special magenta, Sambal red, Laksa indigo, Kacang brown) drives its scenes. Type: Ultra (fat slab, echoing the chalky slab lettering on the packs), Figtree (body/UI), Caveat Brush (handwritten notes).

**Signature.** "Rempah rain": real spice cut-outs fall through the hero; tap one and it is pounded into crumbs with a comic word (SEDAP!, PEDAS!, TOK!, UMPH!) and a synthesised pestle thud (mute toggle, remembered; pauses off-screen; static under reduced motion). Second signature: pinned "Pilih rendang anda" scene for the six rendangs, page colour morphs per pack, pack flips, giant outlined word, spice orbs.

**Pages** (`site-b-ingat-rendang/`, built from `src/site-b/` by `tools/pages.js`): index · shop · product (`?p=…&s=…`) · about (Kisah kami) · why (Kenapa Pak Nil: six promises) · faq · contact.

**Home.** Loader ("Memanaskan kuali…") · topbar marquee · hero (headline, CTAs, trust row, fanned packs, spice rain, tap hint) · two-row marquee · pinned rendang scene · six promises as ketupat badges (pop-ups) · counters · product cards (size toggle, quick view, quick add) · "Bila-bila masa" moments (Pagi Raya, Bekal, Camping, Balik kerja, Tetamu datang) with their reels · reels · quiz "Rendang mana satu awak?" · MIHAS photo fan · agent band · reviews · Instagram grid · footer with giant wordmark. Mascot **Tupat** the ketupat gives tips. Bag → WhatsApp order message.

## 6. Shared rules

- Static HTML/CSS/JS, no build step to open; works from disk and over HTTP; self-contained folders; `.nojekyll`.
- Everything important is clickable (cards → quick view/product, photos → lightbox, videos → lightbox with sound, claims → pop-ups).
- Accessibility: landmarks, keyboard reachable, visible focus, alt text, reduced motion collapses motion, content readable with JS off where practical.
- Performance: WebP, lazy loading below the fold, videos `preload="none"` with posters (except muted hero loops), canvas pauses off-screen.

## 7. Verification

`node --test tests/` (cart maths, WhatsApp messages, product resolve, search, data integrity, page references). Playwright sweep of every page of both concepts at 1280×800, 1440×900 and 1920×1080: no console errors, no failed requests, no horizontal overflow, key interactions (add to cart/bag, quick view, lightbox, chat, language switch, quiz, forms) exercised.

## 8. Out of scope

Real payments or order submission, CMS, pushing to GitHub (offer only), proposal/pricing page.

# Build plan: Rendang Pak Nil two concepts

Spec: `docs/superpowers/specs/2026-10-16-pak-nil-two-sites-design.md` · Rulings: `docs/superpowers/rulings/2026-10-16-pak-nil-two-sites.md`

Folder map (target):

```
index.html                   chooser page (both concepts)
README.md                    how to open, what is real, placeholders
assets/                      chooser previews, favicon
shared/js/                   data.js (content), core.js (pure logic), icons.js
src/site-b/                  Concept B layout, partials, pages (built by tools/pages.js)
site-a-citarasa-istana/      Concept A (Kantan structure; pages hand-written, chrome injected by js/site.js)
site-b-ingat-rendang/        Concept B (ABIN structure; built pages + assets)
tools/                       assets.py, fonts.py, pages.js, sync.js
tests/                       node --test suites
source-assets/               raw downloads (website, instagram, facebook, stock) — not published
```

## Tasks

1. Setup: folders, .gitignore (source-assets/, .playwright-mcp/), .nojekyll, tools/sync.js + tools/pages.js.
2. Fonts: tools/fonts.py downloads woff2 for both concepts (A: Fraunces, Anybody, Hanken Grotesk; B: Ultra, Figtree, Caveat Brush).
3. Assets: tools/assets.py → packs (9 + Warisan mockups), logo badge, photos, Pak Nil cut-out, spice sprites, dish images, video encodes + posters + per-product clips, heat-and-serve stills.
4. Shared content + logic: shared/js/data.js, shared/js/core.js, tests (core, data, pages).
5. Concept A chrome + system: css/site.css (tokens, type, arch motif), js/site.js (header/footer/demo bar, i18n EN/BM, cart, checkout, tour), js/chat.js (Tanya Dapur).
6. Concept A pages: home (+ js/home.js showcase), shop (+ builder), product, serve, agent (+ 5-step form), portal.
7. Concept B system: src/site-b layout + partials, assets/css (base, chrome, pages), shared ui/shop/forms adapted, fx.js (loader, wipes, reveals, mascot Tupat), rempah.js (spice rain), scenes.js (pinned rendang scene).
8. Concept B pages: index, shop, product, about, why, faq, contact.
9. Chooser page, READMEs, CREDITS.
10. Verification sweep (Playwright at 1280×800, 1440×900, 1920×1080; console, requests, overflow, interactions) and fixes; tests green.

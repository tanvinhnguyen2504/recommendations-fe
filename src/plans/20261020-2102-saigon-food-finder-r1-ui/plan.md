# Plan: Saigon Food & Coffee Finder — New UI

## Goal

Turn this repo from an auth-only SPA into the mobile-first bilingual front end of **Saigon
Food & Coffee Finder**: an app for finding a restaurant (quán ăn) or café (cà phê) in Ho Chi
Minh City _right now_. The R1 milestone delivers one complete flow — open the app, set a
location, browse cards, filter and sort, open a place, get directions — in VI and EN, on a
phone, over 4G. Everything else (contribution, map, spin, desktop) is deliberately deferred
so R1 can be shipped and measured.

## Scope

**In scope (R1, phases 1–7 below):**

- Design tokens for light theme, applied by retokenising the existing shadcn/ui primitives.
- i18next with `vi` (default) and `en`, plus locale-aware formatting and VI normalisation.
- App shell with bottom nav; routes `/`, `/place/:id`.
- Discover: collapsing header, category tabs, search bar, sticky filter/sort toolbar, quick
  chips, active-filter chips, result count, `PlaceCard` list, infinite scroll.
- A single `SearchQuery` state driving filter sheet (with live result count), sort sheet, and
  quick/active chips.
- Location bottom sheet: 3-level cascade (area → ward → street) and **old-ward-name search**.
- Place detail: hero, info block, media grid, sticky Save + "Chỉ đường" bar.
- Loading, empty and end-of-list states; accessibility and performance passes.

**In scope (later phases, specified but not built in R1):** Saved, Account, dark theme, PWA
offline, map view, media viewer, add-a-place with moderation, lucky spin, table view,
tablet/desktop layouts.

**Out of scope entirely:**

- Backend work. The API is consumed, never written here.
- The moderation back office (named as an R2 dependency, owned elsewhere).
- Reviews, ratings submission, or user-generated text beyond the add-a-place form.
- Native app wrappers. Delivery is mobile web + installable PWA.

**Explicitly preserved:** the existing cookie-session auth (`/login`, `/onboarding`, CSRF
interceptor, `RequireAuth`). It stops being the product and becomes supporting
infrastructure for Saved and Add-a-place.

## Architecture / Design decisions

**1. The docs' stack is advisory; the installed stack wins.**
`01-implementation-prompt.md` specifies React 18, no UI kit, Zustand, `data-theme`, Be Vietnam
Pro. The repo has React 19, 15 shadcn/ui `radix-nova` primitives, TanStack Query, next-themes
and Geist. The doc's `[STACK]` block says _"Replace the `[STACK]` block if you use a different
stack"_, so we keep what is installed and preserve the design intent instead. Only `i18next`
is genuinely missing and must be added. Recorded in `CLAUDE.md` §"Stack reconciliation".

**2. Tokens become Tailwind 4 CSS variables, and `components/ui/` is retokenised — not rewritten.**
The design is a warm terracotta palette; the Nova primitives ship neutral. Mapping the palette
onto the existing CSS variables once is far cheaper than hand-building 15 primitives, and it
keeps the shadcn CLI usable. Components override sizing at the call site (`h-11`, `size-11`)
because the Nova button is 32–36px and the design demands ≥44px.

**3. One `SearchQuery` object is the single source of truth for results.**
Quick chips, active chips, the filter sheet, the sort sheet and (later) table headers all read
and write the same state. Any second copy drifts and the UI starts misreporting what is
filtered. It lives in a `searchStore`; Zustand is added **only if** URL params + the query
cache prove insufficient — not preemptively.

**4. Sheets are overlay state, not routes.**
Filter, sort, location and spin are all bottom sheets on `vaul`. Making them routes would put
back-button semantics in charge of a transient panel. Optionally mirrored to `?sheet=` for
shareability, which is additive and does not change ownership.

**5. Server state in TanStack Query, never duplicated into `useState`.**
Results are an infinite query keyed by `SearchQuery`. The filter sheet's live count is a
separate debounced query against the _draft_ query, so it can show "Xem 36 kết quả" before the
user commits.

**6. Browsing is public.** `RequireAuth` wraps only `/saved`, `/account` and `/add`. Gating
Discover or Place detail behind sign-in would break the core job the app exists for.

**7. Mock the API behind one boundary.** The real contract lives in a doc that does not exist
yet (see Open questions). All fixtures go in one module with the same shape as the eventual
endpoints, so swapping in the real API is a one-file change, not a hunt.

## Phases

R1 ships after phase 7. Phase numbers here are sequential; the matching phase in
`01-implementation-prompt.md` is noted because they do not line up (the doc skips 6, 8, 9 for R1).

| Phase | File                                                | What it delivers                                             | Doc phase  | Release       |
| ----- | --------------------------------------------------- | ------------------------------------------------------------ | ---------- | ------------- |
| 1     | `plan-1-foundations-tokens-i18n-format.md`          | Tokens, i18next, format/normalise helpers + tests, icon set  | 1          | R1            |
| 2     | `plan-2-app-shell-nav-and-routes.md`                | AppShell, BottomNav, route table, public/gated split         | 2          | R1            |
| 3     | `plan-3-discover-header-and-card-list.md`           | Discover header, toolbar, PlaceCard list, infinite scroll    | 3          | R1            |
| 4     | `plan-4-search-state-filter-and-sort-sheets.md`     | `searchStore`, FilterSheet with live count, SortSheet, chips | 4          | R1            |
| 5     | `plan-5-location-sheet-cascade-and-alias-search.md` | Location sheet: cascade + old-ward-name search, geolocation  | 5          | R1            |
| 6     | `plan-6-place-detail-and-media-grid.md`             | Place detail, media grid, Save + directions bar              | 7          | R1            |
| 7     | `plan-7-states-accessibility-and-r1-launch.md`      | Empty/loading states, a11y pass, perf budget, device QA      | 10a        | **R1 launch** |
| 8     | `plan-8-saved-account-dark-theme-and-pwa.md`        | Saved, Account, dark theme, PWA install + offline            | 10b        | R2            |
| 9     | `plan-9-map-view-and-media-viewer.md`               | Map view with rating pins, full-screen media viewer          | 6a, 7      | R2            |
| 10    | `plan-10-add-a-place-and-moderation.md`             | Add-a-place form, duplicate check, uploads, pending state    | 8          | **R2 launch** |
| 11    | `plan-11-lucky-spin-table-and-responsive.md`        | Lucky spin, table view, tablet/desktop layouts               | 9, 6b, 10c | R3            |

## Success criteria

**R1 is done when all of these hold:**

- The flow open → set location → browse → filter → sort → detail → "Chỉ đường" completes on a
  real phone without a dead end, in both VI and EN.
- `pnpm typecheck` and `pnpm test` pass; `lib/format.ts` and `lib/normalize.ts` have unit tests
  covering both locales, including `normalizeVi('Phường Võ Thị Sáu') === 'phuong vo thi sau'`.
- No hard-coded UI copy anywhere: grepping for Vietnamese diacritics in `src/components` and
  `src/pages` returns only i18n keys.
- Searching a ward by its **old** name (e.g. "Phường Võ Thị Sáu") returns the current ward with
  a "Tên mới" badge.
- Filter state is provably single-source: changing a quick chip updates the active chips, the
  filter sheet and the result count with no manual sync code.
- `gzip -c dist/assets/index-*.js | wc -c` is **under 174,080 bytes** (170 KB).
- No horizontal overflow at 360px in either locale; verified at 360/375/390/430px.
- Every tap target ≥44×44px; axe reports no serious violations; sheets trap focus; tab order
  is logical.
- Prices, decimals, distances and times are locale-correct (`45.000₫`/`4,7`/`1,2 km`/`22:30`
  in VI; `45,000₫`/`4.7`/`1.2 km`/`10:30 PM` in EN).
- Place names are never translated; dish names keep a VI label with an EN hint.
- Tested on iOS Safari (latest and latest-1) and mid-range Android Chrome with the keyboard
  open in every input, on a throttled 4G profile.

## Open questions

These need answers; the first two are already blocking real work.

1. **`02-component-breakdown.md` does not exist on disk.** `README.md` indexes it and doc
   Phase 1 says to take the VI/EN copy from its "§ i18n keys" section. Without it, every
   translation key is invented at the call site and will need reconciling later. Is it coming,
   or should phase 1 define the key namespace itself and become the source of truth?
2. **`03-database-analysis.md` does not exist on disk.** It is cited as the API definition. The
   `IPlace` / `SearchQuery` types in doc 01 are the only contract available, and the
   endpoint list (`GET /places`, `/places/count`, `/locations/search`, `/places/duplicates`,
   `POST /place-submissions`, `/events`) has shapes we are guessing at. Who owns the contract,
   and does the existing Go auth backend host these routes under `/api` too?
3. **The initial JS bundle is already 183 KB gzipped** — over the 170 KB R1 budget before any
   product code is written. Something must give: trim the 15 shadcn primitives down to those
   actually used, drop a dependency, or raise the budget. Which?
4. ~~**Be Vietnam Pro vs the installed Geist.**~~ **Resolved 2026-10-23:** Be Vietnam Pro is
   applied, self-hosted via `@fontsource/be-vietnam-pro` at weights 400/500/600/700/800.
   Geist removed. Open follow-up: the five weights cost ~132 KB of font data on first paint.
5. **Ward/street reference data.** The 3-level cascade and alias search need area → ward →
   street data with old-name aliases for the 2025 HCMC boundary changes. Does that dataset
   exist, and is it served by the API or bundled with the client?
6. **Filter apply semantics.** The design applies filter edits live; doc Phase 4 leaves
   apply-on-confirm as an option. Live is assumed here, which makes the sheet's "Xem 36 kết quả"
   button a dismiss action rather than a commit.
7. **Saved before auth.** Doc 04 lists Saved as depending on "auth or device id". The heart
   button is visible on R1 cards. Does tapping it in R1 prompt sign-in, store locally, or stay
   hidden until R2?

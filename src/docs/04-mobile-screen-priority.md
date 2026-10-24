# Mobile Screen Priority — Saigon Food & Coffee Finder (Mobile web / PWA)

Platform decision: **mobile web, installable as a PWA**. Phone layouts (360–430 px wide) ship first; tablet and desktop come last.

## 1. How screens were ranked

Each screen was scored on four questions:

1. **Core job.** Does it help someone find a place to eat or drink *right now*? That is the reason the app exists.
2. **Dependency.** Do other screens need it first (state, components, data)?
3. **Phone fit.** Is it natural on a small touch screen, one-handed, on the street?
4. **Data readiness.** Can it work with the data we will have at launch?

Priority levels:
- **P0:** launch blocker; the app is useless without it.
- **P1:** expected soon after launch; strong retention or data value.
- **P2:** delight or power-user feature; build once the core is stable.

## 2. Screen ranking

| Rank | Screen (artboards) | Priority | Release | Why | Depends on | Effort |
|---|---|---|---|---|---|---|
| 1 | **Discover — card list** (Main, HomeEN) | P0 | R1 | The core job: browse nearby places | Tokens, i18n, `PlaceCard`, places API | L |
| 2 | **Filter sheet + quick chips + active chips** (FilterVI/EN) | P0 | R1 | Narrowing results is the main interaction | Discover, search store, count API | L |
| 3 | **Location sheet: cascade + old-name search** (Location, LocationSearch) | P0 | R1 | Results are meaningless without "where"; old ward names are a real 2025 pain point | Area/ward/street data + aliases | M |
| 4 | **Sort sheet** (Sort) | P0 | R1 | Small effort, needed with filters | Search store | S |
| 5 | **Place detail — info + media grid** (Detail) | P0 | R1 | Users need to decide and get directions | Place + media API | M |
| 6 | **Loading + empty states** (Loading, Empty) | P0 | R1 | Slow 4G and strict filters are common; dead ends hurt trust | Discover | S |
| 7 | **Bottom nav + VI/EN toggle** (all) | P0 | R1 | Navigation shell; bilingual is a launch requirement | Shell | S |
| 8 | **Saved** (Saved tab) | P1 | R2 | Retention: "places I want to try" | Auth or device id, saves API | S |
| 9 | **Map view** (Map) | P1 | R2 | High value on a phone ("what's around me"), but a heavy library and slower on low-end phones | Map SDK, geodata | M |
| 10 | **Media viewer** (DetailViewer) | P1 | R2 | The grid covers launch; full-screen swipe viewing is the next step | Detail | M |
| 11 | **Add a place + duplicate check + submitted** (AddPlace, AddDone) | P1 | R2 | Grows coverage and improves recommendations; needs the moderation tool behind it | Uploads, moderation queue | L |
| 12 | **Account: language, theme, default location** (Account) | P1 | R2 | VI/EN is already in the header for R1; Account makes it permanent | Prefs storage | S |
| 13 | **Dark theme** (HomeDark, FilterDark) | P1 | R2 | Token-driven, so cheap once tokens exist; keep it R2 to protect R1 QA time | Tokens | S |
| 14 | **Lucky spin: place + area** (Spin, SpinResult, SpinArea) | P2 | R3 | Delight and engagement, not core; its weighting is better once usage data exists | Places API, spin log | M |
| 15 | **Compact table view** (Table) | P2 | R3 | Dense comparison is awkward at 390 px; a power-user mode | Search store | M |
| 16 | **Tablet / desktop layouts** | P2 | R3+ | Most traffic is expected on phones | Everything | L |

Effort: S ≈ 1–2 days, M ≈ 3–5 days, L ≈ 1–2 weeks for one front-end developer.

## 3. Release slices

### R1 — "Find a place near me" (MVP)
Flow: Open the app → set the location → browse cards → filter/sort → open a place → get directions.

- **In:**
  - Discover cards, category tabs, quick chips, active chips.
  - Filter, sort and location sheets.
  - Detail with the media grid; "Chỉ đường" deep link.
  - Loading, empty and end-of-list states.
  - Bottom nav (Discover active; Map, Saved and Account can show "coming soon" or be hidden).
  - VI/EN toggle; light theme.
- **Hide in R1:**
  - the lucky spin button;
  - the "Thêm quán mới" call-to-action (or link it to a simple feedback form);
  - the view toggle, which can stay cards-only (hide the table and map icons).
- **Success metric:** search → detail → directions conversion; how often filters return zero results.

### R2 — "Come back and contribute"
- **In:**
  - Saved, map view and media viewer.
  - Add a place, with the moderation back office.
  - Account settings and dark theme.
  - PWA install prompt and offline cache for saved places.
- **Success metric:** 7-day return rate, saves per user, approved submissions per week.

### R3 — "Delight and power"
- **In:**
  - lucky spin, weighted by R1–R2 usage data;
  - table view;
  - tablet and desktop layouts.
- **Success metric:** spin → accepted ("Xem quán") rate; sessions per user.

## 4. Mobile-web rules to apply from R1

| Topic | Rule |
|---|---|
| Viewport | `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; full-height screens use `100dvh`, not `100vh` (the iOS Safari toolbar changes height) |
| Safe areas | Bottom nav, sheet footers and the spin button add `padding-bottom: env(safe-area-inset-bottom)` |
| Input zoom | iOS zooms into inputs under 16px, so **raise every `<input>`/`<textarea>` to 16px** (the design uses 15px) |
| Keyboard | In the location search and Add a place form, keep the focused field visible (`scrollIntoView({block:'center'})`) and move sticky footers above the keyboard using the `visualViewport` API |
| Sheets | `overscroll-behavior: contain`; lock body scroll while a sheet is open; swipe down to close; animations under 250 ms |
| Touch | Targets ≥ 44 px, `touch-action: manipulation`, no hover-only UI (`@media (hover:hover)` for hover styles) |
| Performance | Budget: first load ≤ 170 KB JS gzip, LCP < 2.5 s on mid-range Android over 4G; lazy-load the map SDK (R2) and the spin feature (R3); responsive images (`srcset`, WebP/AVIF), blurhash placeholders |
| Location | Geolocation needs HTTPS and a user tap ("Dùng vị trí hiện tại"); never prompt on load; fall back to the manual cascade |
| Camera upload (R2) | `<input type="file" accept="image/*,video/*" capture="environment" multiple>`; compress on the device before upload (max 2048 px, ~80% JPEG/WebP) |
| Offline (R2) | Service worker: cache the app shell, area/ward/street reference data and saved places; show an offline banner |
| Directions | "Chỉ đường" opens `https://www.google.com/maps/dir/?api=1&destination=lat,lng` (opens the native app on Android/iOS) |
| Share | Web Share API on Detail (`navigator.share`), falling back to copy link |

## 5. Screen-level phone notes

- **Discover:** the header is tall (about 300 px before results). On scroll, collapse the location + search rows and keep only the sticky filter/sort toolbar, so cards get about 70% of the screen.
- **Filter sheet:** open it at 90% height. The "Xem N kết quả" footer must stay above the safe area.
- **Location sheet:** autofocus the search input only when it was opened from search; otherwise show the cascade first, so the keyboard doesn't cover the list.
- **Detail:** sticky action bar at the bottom (Save + Directions), within thumb reach. Lazy-load the gallery below the fold.
- **Add a place (R2):** split it into 3 short steps on small phones (≤ 360 px wide): 1. name + duplicate check, 2. address + pin, 3. details + photos. That reduces keyboard thrash.
- **Map (R2):** a full-screen map with the place card at the bottom; a "Danh sách" button switches back to the list.

## 6. Suggested sprint plan (2-week sprints)

| Sprint | Scope |
|---|---|
| S1 | Tokens, i18n, format/normalise helpers, shell + nav, PlaceCard, Discover list against mock data |
| S2 | Search store, quick/active chips, sort sheet, filter sheet with live count, loading/empty states |
| S3 | Location sheet (cascade + alias search), Detail + media grid, directions; real API integration |
| S4 | R1 hardening: performance budget, accessibility pass, iOS/Android browser QA → **R1 launch** |
| S5 | Saved, Account, dark theme, PWA install + offline |
| S6 | Map view, media viewer |
| S7 | Add a place + uploads + moderation back office → **R2 launch** |
| S8+ | Lucky spin, table view, tablet/desktop → **R3** |

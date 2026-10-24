# Implementation Prompt — Saigon Food & Coffee Finder

> Copy everything below the line into your AI coding assistant. It is written to be used **one phase at a time**: send the "Project context" plus one phase, review the result, then continue. Replace the `[STACK]` block if you use a different stack.
>
> **Mobile-first release order** (see `04-mobile-screen-priority.md`). Every phase is tagged with its release. Build R1 phases first and only the R1 parts of mixed phases:
>
> | Release     | Phases, in build order                                                                             |
> | ----------- | -------------------------------------------------------------------------------------------------- |
> | **R1, MVP** | 1 → 2 → 3 (without the lucky spin button and add-place CTA) → 4 → 5 → 7 (without the viewer) → 10a |
> | **R2**      | 10b (Saved, Account, dark theme) → 6a (map) → 7 viewer → 8 → PWA offline/install                   |
> | **R3**      | 9 → 6b (table) → 10c (tablet/desktop)                                                              |

---

## Project context (send with every phase)

You are building the front end of **Saigon Food & Coffee Finder**, a mobile-first app for discovering restaurants (quán ăn) and cafés (cà phê) in Ho Chi Minh City. A high-fidelity design exists; follow it exactly as described here.

**[STACK]**

- React 18 + TypeScript (strict), Vite, React Router.
- Styling: CSS Modules or Tailwind with the tokens below exposed as CSS variables. No UI kit.
- State: Zustand (or React context + reducer) for app-wide state; React Query for server data.
- i18n: `i18next` with `vi` (default) and `en` namespaces.
- Icons: inline stroke SVG components (24px grid, 1.8–2px stroke, round caps). No emoji anywhere in the UI.
- Font: **Be Vietnam Pro** (Google Fonts) 400/500/600/700/800, fallback `'Segoe UI', system-ui, sans-serif`.
- Delivery: **mobile web, installable PWA** (`vite-plugin-pwa`; the manifest and service worker arrive in R2).
- Target viewport 390×844; must also work from 360 to 430 px wide. **Phone only until R3**: do not build tablet/desktop layouts earlier, but don't hard-code a 390 px width either (the root is fluid, with max-width 480px centred on larger screens).

**Mobile-web rules**

- Viewport meta with `viewport-fit=cover`. Full-height screens use `100dvh`.
- `env(safe-area-inset-bottom)` padding on the bottom nav, sheet footers, sticky bars and the spin button.
- Every `<input>`/`<textarea>` has a font-size of **16px** (prevents iOS zoom), even where the design shows 15px.
- Sheets: `overscroll-behavior: contain`, lock body scroll while one is open, swipe down to close.
- Keep focused inputs above the on-screen keyboard (`visualViewport` resize → lift sticky footers).
- `touch-action: manipulation`; hover styles only inside `@media (hover: hover)`.
- Performance budget: ≤ 170 KB gzip initial JS; lazy-load the map SDK and the spin feature as separate chunks; images via `srcset` + WebP/AVIF + blurhash placeholders.
- Geolocation only after a user tap; HTTPS required; fall back to the manual location cascade.
- On scroll, the Discover header collapses (location + search rows hide) while the filter/sort toolbar stays sticky.

**Global rules**

1. Every tap target is ≥ 44×44 px. Primary actions sit in the lower half of the screen (sheet footers, sticky bars).
2. All panels (location, filters, sort, lucky spin) are **bottom sheets** with a drag handle, a scrim that closes on tap, `role="dialog"` and `aria-modal="true"`, and focus trapped inside.
3. Use real `<button>`, `<input>`, `<label>`, `<a>` elements; icon-only buttons need `aria-label`; toggles use `aria-pressed`; tabs use `role="tab"` + `aria-selected`.
4. Text contrast ≥ 4.5:1 (WCAG AA) in both themes.
5. **Every string goes through i18n.** No hard-coded copy in components.
6. **Place names never get translated** (Nguyễn Huệ, Phường Xuân Hòa, Bình Thạnh). District labels can translate ("Quận 3" ↔ "District 3"). Dish names stay Vietnamese; in EN mode add a hint: `Cơm tấm · broken rice`.
7. Locale formatting:
   - Prices: `45.000₫` (vi) / `45,000₫` (en).
   - Decimals: `4,7` (vi) / `4.7` (en). Distances: `350 m`, `1,2 km` (vi) / `1.2 km` (en).
   - Time: 24h in vi (`22:30`), 12h in en (`10:30 PM`).
8. Long strings must truncate with an ellipsis or wrap; nothing may overflow horizontally (EN and VI lengths differ a lot).
9. Light theme first; a dark theme switches via a `data-theme="dark"` attribute on `<html>`.

**Design tokens**

| Token                    | Light                 | Dark                  | Use                                   |
| ------------------------ | --------------------- | --------------------- | ------------------------------------- |
| `--bg`                   | `#FBF7F2`             | `#16110E`             | app background                        |
| `--surface`              | `#FFFFFF`             | `#221A15`             | cards, sheets, nav                    |
| `--surface-2`            | `#F3EBE3`             | `#2E241D`             | inputs, segmented tracks              |
| `--ink`                  | `#2B1D15`             | `#F4EAE2`             | primary text                          |
| `--ink-2`                | `#6A5446`             | `#C4B1A3`             | secondary text                        |
| `--ink-3`                | `#CDBCAF`             | `#5E4D42`             | decorative (unused ₫, dashed borders) |
| `--line`                 | `#E8DDD3`             | `#3B2F27`             | borders, dividers                     |
| `--primary`              | `#B4532F`             | `#E8906A`             | terracotta: buttons, active states    |
| `--on-primary`           | `#FFFFFF`             | `#1B0F09`             | text on primary                       |
| `--tint` / `--tint-ink`  | `#F7E4DA` / `#8C3C1E` | `#3C271D` / `#F6B898` | selected chips                        |
| `--open` / `--open-tint` | `#1D7A4C` / `#E2F2E8` | `#66CC98` / `#173220` | "Đang mở / Open"                      |
| `--star`                 | `#C27A12`             | `#F0B24A`             | star icon                             |
| `--scrim`                | `rgba(28,18,12,.48)`  | `rgba(0,0,0,.62)`     | sheet backdrop                        |
| `--skel`                 | `#EDE3D9`             | `#2F261F`             | skeleton blocks                       |

Radii: chips 999px, inputs/buttons 12–14px, cards 16px, sheets 22px (top corners). Shadows are soft and warm (`0 6px 18px rgba(60,35,20,.08)`). Spacing scale: 4 / 8 / 12 / 16 / 20 / 24. Page side padding 16px.

**Data contracts** (mock them first; the API is defined in `03-database-analysis.md`)

```ts
type Category = 'food' | 'cafe';
interface IPlace {
  id: string;
  name: string;
  category: Category;
  rating: number | null;
  reviewCount: number;
  priceLevel: 1 | 2 | 3;
  avgPricePerPerson: number; // VND
  distanceM: number;
  street: string;
  areaId: string;
  isOpen: boolean;
  closesAt?: string;
  opensAt?: string;
  is24h: boolean;
  coverPhotoUrl?: string;
  coverCaption?: string;
  tags: string[]; // tag keys, e.g. 'work','wifi','aircon'
  cuisine?: string | null; // 'pho','bun','comtam',...
  status: 'approved' | 'pending';
  isSaved: boolean;
  lat: number;
  lng: number;
}
interface SearchQuery {
  category: 'all' | Category;
  areaId?: string;
  wardId?: string;
  streetId?: string;
  filters: {
    tagKeys: string[];
    priceLevels: number[];
    cuisines: string[];
    openNow: boolean;
    openLate: boolean;
    open24h: boolean;
    radiusM?: 500 | 1000 | 3000 | 5000;
    minRating?: 3.5 | 4 | 4.5;
  };
  sort:
    | 'relevant'
    | 'nearest'
    | 'rating'
    | 'price_asc'
    | 'price_desc'
    | 'newest'
    | 'name'
    | 'open_first';
  cursor?: string;
}
```

---

## Phase 1 — Foundations `[R1]`

Build:

- `tokens.css` with the variables above for both themes, plus base typography (15px body, line-height 1.4).
- i18n setup with `vi` and `en` resources. Use the copy listed in `02-component-breakdown.md § i18n keys`.
- Formatting helpers in `lib/format.ts`: `formatVnd(n, locale)`, `formatDecimal(x, locale)`, `formatDistance(m, locale)`, `formatTime('22:30', locale)`, `formatCount(n, locale)`. Write unit tests for each, covering both locales.
- `lib/normalize.ts`: `normalizeVi(s)` → lower case, NFD-strip diacritics, `đ`→`d` (used for search and duplicate checks). Test: `normalizeVi('Phường Võ Thị Sáu') === 'phuong vo thi sau'`.
- An `Icon` set: pin, chevron (down/right/left), search, sliders, sort, x, check, heart, star, cards, table, map, compass, bookmark/heart, user, locate, clock, image, play, menu-doc, plus, dice, navigate, grid.

Done when: the tests pass and a token preview page renders both themes.

## Phase 2 — App shell `[R1]`

R1: only Discover is live in the nav. Hide the Map, Saved and Account items, or show them as disabled with "Sắp ra mắt / Coming soon", until R2.

- `AppShell` = full-height column: screen content (flex 1, min-height 0) + `BottomNav`.
- `BottomNav`: 4 items — Khám phá/Discover, Bản đồ/Map, Đã lưu/Saved, Tài khoản/Account; icon + 11px label; active = primary colour + weight 700, `aria-current="page"`. Map selects the Discover screen in map view. Hide the nav on Place Detail and Add Place.
- Routes: `/` (discover), `/saved`, `/account`, `/place/:id`, `/add`. Sheets are overlay state, not routes (optionally synced to `?sheet=`).

## Phase 3 — Discover header and results (card view) `[R1; items 9 and 11 are R2/R3]`

R1: the `ViewToggle` shows only the card view (hide the table and map icons). Leave out `AddPlaceCta` (R2) and `LuckySpinFab` (R3), but keep space for them in the layout.

Header (sticky, `--bg`):

1. Row: `LocationChip` (pill, pin icon in primary, text `Quận 3 · Võ Văn Tần`, chevron; ellipsis) + `LanguageToggle` (VI | EN segmented, active = ink background with bg-coloured text).
2. `SearchBar` (46px, surface-2, search icon, placeholder "Tìm món, tên quán…").
3. `CategoryTabs` segmented control: Tất cả · Quán ăn · Cà phê (active segment = surface + small shadow).

Sticky toolbar (surface, top/bottom border): 4. `FilterButton` ("Bộ lọc" + count badge; tinted when filters are active) + `SortButton` (flex 1: "Sắp xếp: **Đánh giá cao nhất**" + chevron; primary border when not default). 5. `QuickFilterRow`: horizontally scrolling chips — Đang mở, Giá rẻ, Có máy lạnh, Phù hợp làm việc, Có chỗ đậu xe máy, Đánh giá 4,5+. Selected = tint background + primary border + check icon.

Results: 6. `ActiveFilterRow` (only when filters are active): dark ink chips with an × for each active filter, including sheet-only filters like "Trong 1 km"; a trailing "Xóa tất cả" link. 7. `ResultCountBar`: "36 quán tại Quận 3" (`aria-live="polite"`) + `ViewToggle` (card / table / map icon buttons). 8. `PlaceCard` list (gap 22px, bottom padding 96px for the FAB):

- Photo 156px, radius 16; category pill top-left (+ "Chờ duyệt" pill when pending); heart button 44px top-right (white circle); dish caption bottom-left.
- Below: name (17/700, ellipsis) + price level (`₫₫` dark + remaining `₫` muted, `aria-label="Mức giá 2 trên 3"`); ★ rating (reviews) · distance · ~avg₫/người; street, district; status dot + "Đang mở · đến 22:30" in green, or "Đã đóng · mở lúc 06:00" in ink-2.
- The whole card is one button (opens detail); the heart sits above it (z-index) as a separate button.

9. `AddPlaceCta` card (dashed border): "Không thấy quán bạn biết?" + "Thêm quán mới" button.
10. Infinite scroll: a skeleton card + "Đang tải thêm…" at the end; fetch the next page with an IntersectionObserver.
11. `LuckySpinFab`: pill button bottom-right, 92px above the bottom, ink background, dice icon + "Ngẫu nhiên". Hidden in map view and while loading.

## Phase 4 — Filter and sort state, sheets `[R1]`

- One store slice `searchStore` holds `SearchQuery`. Quick chips, active chips, the filter sheet and table headers all read and write the **same** state.
- `FilterSheet` (full height, 800px of 844):
  - Header: "Bộ lọc" + "N đang chọn" + close.
  - Scroll body, one `<fieldset>` per section:
    - Mức giá: 3 tiles ₫ / ₫₫ / ₫₫₫ with VND ranges, multi-select.
    - Món ăn: wrap chips, EN hints.
    - Không gian quán cà phê: wrap chips.
    - Giờ mở cửa: Đang mở / Mở khuya (sau 22:00) / Mở 24h.
    - Khoảng cách "Tính từ Võ Văn Tần": 4-up single-select 500 m / 1 km / 3 km / 5 km, tap again to clear.
    - Đánh giá tối thiểu: Bất kỳ / 3,5+ / 4,0+ / 4,5+.
    - Tiện ích: checkbox rows.
  - Sticky footer: "Xóa tất cả" (outline) + "Xem 36 kết quả" (primary, flex 1). The count is **live**: debounce 250 ms and call `GET /places/count` with the draft query. The button is greyed when the count is 0.
  - Decide whether edits apply live or on "Xem kết quả" (the design applies live; keep a draft copy if you prefer apply-on-confirm).
- `SortSheet`: 6 rows (52px) — Phù hợp nhất, Gần nhất, Đánh giá cao nhất, Giá thấp → cao, Giá cao → thấp, Mới mở. The selected row is tinted with a check. Selecting one closes the sheet.

## Phase 5 — Location sheet `[R1]`

- Height 772px. Search input "Tìm quận, phường, tên đường…", with the hint "Tìm được cả tên cũ, ví dụ "Phường Võ Thị Sáu"".
- "Dùng vị trí hiện tại" button (tinted) → Geolocation API → reverse lookup.
- "Gần đây" horizontal chips (clock icon) from the user's recent locations.
- Breadcrumb `Quận 3 › Phường Xuân Hòa › Võ Văn Tần`: each crumb jumps back to that level.
- Level tabs 1 Khu vực · 2 Phường · 3 Gần đường…; the active tab has a primary underline and a filled number badge. A hint line under the tabs explains each level.
- Lists:
  - Areas show "N phường mới · chọn để xem".
  - Wards show "Tên cũ: Phường Võ Thị Sáu".
  - Streets show the popular streets in that ward.
  - The selected row is tinted with a check; others show a chevron.
- Search mode (query not empty): one results list mixing Area / Ward / Street. A ward matched through an **old name** shows a green "Tên mới" badge and "Tên cũ: … · Quận 3". Matching is diacritic-insensitive (`normalizeVi`), server-side via `GET /locations/search?q=`.
- Footer: "Xem quán ở khu vực này".

## Phase 6 — Table and map views `[6a map: R2 · 6b table: R3]`

- `ResultsTable`: a horizontally scrolling box. Use div rows with ARIA roles (`role="table|row|columnheader|rowheader|cell"`).
  - Columns: Tên quán 160 (**sticky left**, right shadow), Đánh giá 88, Giá 108 (₫ + ~avg), Khoảng cách 88, Trạng thái 116 (pill).
  - Header buttons set the sort, so the table and the Sort control stay in sync: Name ↑, Rating ↓, Price toggles ↑/↓, Distance ↑, Status (open first). Show the arrow and `aria-sort`.
- `ResultsMap`: use MapLibre GL / Google Maps.
  - Pins are pills showing the rating (selected = primary).
  - A "selected location" blue dot.
  - A bottom `MapPlaceCard` button (88px thumb, category, name, ★ · distance · ₫, status) that opens the detail.

## Phase 7 — Place detail and media `[R1; MediaViewer and "Thêm ảnh" upload are R2]`

R1: in the grid, tapping a tile opens the image full size in a simple overlay (no thumbnail strip). Add Web Share (`navigator.share`) next to the heart.

- Route `/place/:id`, no bottom nav.
- Hero 248px:
  - Back and heart buttons (44px white circles) at the top.
  - Cover caption bottom-left.
  - "Xem 12 ảnh & video" pill bottom-right that opens the viewer.
- Info block:
  - Category pill (+ "Chờ duyệt"), H1 name 24/800.
  - ★ rating (reviews) · distance · price level; address · ~avg₫/người; status; tag pills (non-interactive).
- `MediaGallery` section:
  - Title "Ảnh & video · 12" + "Thêm ảnh" (a label wrapping a hidden `input type=file accept="image/*,video/*" multiple`).
  - Tabs with counts: Tất cả, Món ăn, Không gian, Thực đơn, Video.
  - Grid of 3 columns, 116px rows, 4px gap; **the first tile spans 2×2** when there are ≥ 3 items.
  - Video tiles: centred play icon + duration badge. Menu tiles: document icon. Every tile has a caption.
  - Empty state for pending places: "Chưa có ảnh nào. Bạn là người đầu tiên chia sẻ nhé!"
- `MediaViewer` (full-screen dialog, `#0F0B09`):
  - Counter "4 / 12" + close.
  - Media fills the remaining height; video has a play button and a progress bar.
  - Caption + "Ảnh từ quán · Món ăn" / "Khách chia sẻ · …".
  - Thumbnail strip (selected = white border, others 55% opacity) and Previous / Next buttons.
  - Keyboard ←/→/Esc, and swipe on touch.
- Sticky bottom bar: "Lưu / Đã lưu" (outline, heart) + "Chỉ đường" (primary, opens a maps deep link).

## Phase 8 — Add a place `[R2]`

On phones ≤ 360 px wide, split the form into 3 steps (name + duplicate check → address + pin → details + photos), with a progress indicator. Photo input uses `capture="environment"`; compress images on the device (max 2048 px) before upload.

- Route `/add`, opened from the results CTA, the empty state and Account › Đóng góp. Header: × + "Thêm quán mới".
- Form fields:
  1. Tên quán\* — live **duplicate check**: debounce 300 ms, `GET /places/duplicates?name=&lat=&lng=`. Matches show as a tinted box "Có phải quán này? Đã có trong danh sách:", each with "Đúng quán này" (opens that place's detail) and the hint "Nếu không phải, cứ tiếp tục nhé."
  2. Loại quán (Quán ăn / Cà phê segmented; switching it resets the highlights).
  3. Địa chỉ\*: a location chip (opens the Location sheet), a "Số nhà, tên đường" input, and a 128px mini map with a centre pin ("Kéo bản đồ để ghim đúng cửa quán").
  4. Mức giá (3 tiles, single-select).
  5. Đặc điểm nổi bật: cuisine chips for food or vibe chips for cafés, plus amenities.
  6. Giờ mở cửa: two `input type=time`.
  7. Ảnh & video: a dashed "Thêm" tile + previews (max 7) and the helper text.
  8. Ghi chú (textarea, optional).
- Footer: the hint "Quán hiện ngay trong kết quả với nhãn "Chờ duyệt"." + a "Gửi quán" submit button, disabled until name ≥ 2 and street ≥ 2.
- Submit: upload the media (presigned URLs), then `POST /place-submissions`. On success show the thank-you state (green check, explanation, "Xem quán vừa thêm" / "Về trang Khám phá"). Insert the place into the user's results optimistically with `status: 'pending'`.

## Phase 9 — Lucky spin `[R3]`

- `LuckySpinSheet`:
  - Title "Quay ngẫu nhiên"; a mode toggle Chọn quán / Chọn khu vực; a subtitle ("Quay trong 8 quán khớp bộ lọc của bạn").
  - Wheel: 280px, `conic-gradient` segments (max 8; palette `#B4532F #F4DCCB #5E3A26 #EDB78F #1D7A4C #FBEFE4 #8E5B3B #CFE5D6`, label colours alternating white / `#2B1D15`).
  - Labels rotated along the radius; an ink pointer at the top; a centre hub button "QUAY"; a primary "Quay!" button below.
- Spin maths:
  - Pick the winner index `i` **before** animating (from the server in place mode, so it can be weighted; see the DB doc).
  - Target rotation = `ceil(current/360)*360 + 1800 + (360 − (i·seg + seg/2))`.
  - Animate `transform` over 3.2 s with `cubic-bezier(.12,.68,.14,1)`; respect `prefers-reduced-motion` (skip to the result).
- Result:
  - Place mode: a tinted card "Hôm nay thử quán này nhé" + thumb, name, ★ · distance · ₫, status + "Quay lại" / "Xem quán".
  - Area mode: "Hôm nay khám phá Bình Thạnh!" + "N phường mới · bộ lọc hiện tại vẫn giữ nguyên" + "Quay lại" / "Xem quán ở đây" (sets the location).
- Announce the result with `role="status"`. Log the spin and its outcome (`POST /events`).

## Phase 10 — States, theming, responsive, QA `[10a: R1 · 10b: R2 · 10c: R3]`

**10a (R1):** `EmptyState`, `LoadingState`, the QA checklist. **10b (R2):** `SavedScreen`, `AccountScreen`, dark theme, PWA manifest + offline cache for the app shell, reference data and saved places. **10c (R3):** responsive tablet/desktop.

- `EmptyState`: a cup icon in a tint circle, "Chưa có quán nào khớp", the helper text, "Mở rộng lên 3 km" (primary), "Xóa tất cả" (outline), and an "add a place" link.
- `LoadingState`: a skeleton count bar + 3 skeleton cards (no shimmer needed; if you add one, respect reduced motion).
- `SavedScreen`: title, "N quán đã lưu", the card list or an empty hint.
- `AccountScreen`:
  - Guest card + "Đăng nhập".
  - Settings: Ngôn ngữ · Language (Tiếng Việt | English), Giao diện (Sáng | Tối), Vị trí mặc định (opens the Location sheet).
  - Đóng góp: "Thêm quán mới" + a pending count.
- Responsive:
  - ≥ 768 px: the nav becomes a left rail, cards go 2-up, quick chips wrap, the filter sheet becomes a 380 px right panel, and sort becomes a dropdown.
  - ≥ 1200 px: a persistent filter sidebar, 3-up cards, a 40/60 list | map split with hover-linked pins, and the full table without horizontal scroll.
- QA checklist:
  - Every artboard state is reproducible in both locales and themes.
  - No horizontal overflow at 360 px.
  - Test on real devices: iOS Safari (latest and latest-1) and Chrome on a mid-range Android, including the keyboard open in every input, safe areas on notched phones, landscape not breaking the layout, and slow 4G throttling.
  - axe has no serious violations.
  - Tab order is logical and sheets trap focus.
  - Numbers, dates and distances are formatted per locale.

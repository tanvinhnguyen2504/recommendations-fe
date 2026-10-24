# Phase 3 — Discover header and card list

> Doc phase 3 · Release R1 · The screen the app exists for.

## Goal

Render the core browse experience: a collapsing header, a sticky filter/sort toolbar, and an
infinite list of `PlaceCard`s against mocked data.

## Tasks

- [ ] `LocationChip`: pill, pin icon in `--primary`, text `Quận 3 · Võ Văn Tần`, chevron,
      ellipsis on overflow. Opens the location sheet (phase 5).
- [ ] `LanguageToggle`: VI | EN segmented control; active segment is ink background with
      bg-coloured text.
- [ ] `SearchBar`: 46px tall, `--surface-2`, search icon, placeholder "Tìm món, tên quán…".
- [ ] `CategoryTabs`: segmented Tất cả · Quán ăn · Cà phê; active segment is `--surface` with a
      small shadow; `role="tab"` + `aria-selected`.
- [ ] Sticky toolbar on `--surface` with top and bottom border: `FilterButton` ("Bộ lọc" +
      count badge, tinted when active) and `SortButton` (flex 1, "Sắp xếp: **Đánh giá cao
      nhất**", primary border when not default).
- [ ] `QuickFilterRow`: horizontally scrolling chips — Đang mở, Giá rẻ, Có máy lạnh, Phù hợp
      làm việc, Có chỗ đậu xe máy, Đánh giá 4,5+. Selected = `--tint` background, primary
      border, check icon.
- [ ] `ActiveFilterRow`: dark ink chips with an × per active filter — including sheet-only ones
      like "Trong 1 km" — plus a trailing "Xóa tất cả" link. Renders only when filters are on.
- [ ] `ResultCountBar`: "36 quán tại Quận 3" with `aria-live="polite"`, plus `ViewToggle`
      (cards only in R1; table and map icons hidden).
- [ ] `PlaceCard` per the spec: 156px photo at radius 16, category pill top-left ("Chờ duyệt"
      pill when pending), 44px heart button top-right on a white circle, dish caption
      bottom-left; then name (17/700, ellipsis) + price level (`₫₫` dark, remaining `₫` muted,
      `aria-label="Mức giá 2 trên 3"`); ★ rating (reviews) · distance · ~avg₫/người; street and
      district; status dot with "Đang mở · đến 22:30" in `--open` or "Đã đóng · mở lúc 06:00"
      in `--ink-2`.
- [ ] Card list with 22px gaps and 96px bottom padding (reserved for the R3 spin FAB).
- [ ] Infinite scroll: `useInfiniteQuery` + `IntersectionObserver` sentinel, a skeleton card and
      "Đang tải thêm…" at the end.
- [ ] Collapse the header on scroll (location + search rows hide, toolbar stays sticky).
- [ ] Mock `GET /places` behind a single fixtures module.

## Implementation notes

- **The whole card is one button that opens the detail, and the heart is a separate button
  stacked above it via z-index.** Nesting a button inside a button is invalid HTML and breaks
  both keyboard and screen-reader behaviour — use sibling elements in a positioned container.
- Reserve layout space for `AddPlaceCta` (R2) and `LuckySpinFab` (R3) now; retrofitting 96px of
  bottom padding later means re-tuning every scroll position.
- Header collapse should drive off a scroll threshold with a CSS transform, not conditional
  unmounting — unmounting the search input would drop focus and the keyboard mid-type.
- The price level needs an `aria-label`, because `₫₫` followed by a muted `₫` is meaningless
  to a screen reader.
- `aria-live="polite"` belongs on the count, not the list: announcing 36 cards is hostile.
- Query key must include the whole `SearchQuery` so phase 4's filters invalidate correctly
  without manual refetching.

## Verify

Scrolling loads a second page via the observer, not a button. The header collapses and the
toolbar stays stuck. Tapping a card opens `/place/:id`; tapping the heart does **not** navigate.
Cards render correctly in both locales at 360px with no horizontal overflow, and a pending
place shows the "Chờ duyệt" pill.

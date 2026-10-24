# Phase 11 — Lucky spin, table view, responsive layouts

> Doc phases 9, 6b and 10c · Release R3 · Delight and power users.

## Goal

Add the engagement feature, the power-user comparison view, and finally the larger screens.

## Tasks

**Lucky spin (doc phase 9)**

- [ ] `LuckySpinFab`: pill button bottom-right, 92px above the bottom, ink background, dice icon
      + "Ngẫu nhiên". Hidden in map view and while loading.
- [ ] `LuckySpinSheet`: title "Quay ngẫu nhiên", mode toggle Chọn quán / Chọn khu vực, subtitle
      "Quay trong 8 quán khớp bộ lọc của bạn".
- [ ] Wheel: 280px, `conic-gradient` segments, max 8, palette
      `#B4532F #F4DCCB #5E3A26 #EDB78F #1D7A4C #FBEFE4 #8E5B3B #CFE5D6`, labels alternating
      white / `#2B1D15`, rotated along the radius; ink pointer at the top; centre hub "QUAY"
      button; primary "Quay!" button below.
- [ ] Pick the winner index `i` **before** animating (from the server in place mode so it can be
      weighted).
- [ ] Target rotation = `ceil(current/360)*360 + 1800 + (360 − (i·seg + seg/2))`.
- [ ] Animate `transform` over 3.2s with `cubic-bezier(.12,.68,.14,1)`; under
      `prefers-reduced-motion`, skip straight to the result.
- [ ] Place-mode result: tinted card "Hôm nay thử quán này nhé" + thumb, name, ★ · distance · ₫,
      status, "Quay lại" / "Xem quán".
- [ ] Area-mode result: "Hôm nay khám phá Bình Thạnh!" + "N phường mới · bộ lọc hiện tại vẫn
      giữ nguyên" + "Quay lại" / "Xem quán ở đây" (sets the location).
- [ ] Announce the result with `role="status"`; log the spin via `POST /events`.
- [ ] Lazy-load the whole spin feature as its own chunk.

**Table view (doc phase 6b)**

- [ ] `ResultsTable`: horizontally scrolling, div rows with
      `role="table|row|columnheader|rowheader|cell"`.
- [ ] Columns: Tên quán 160 (**sticky left**, right shadow), Đánh giá 88, Giá 108 (₫ + ~avg),
      Khoảng cách 88, Trạng thái 116 (pill).
- [ ] Header buttons set the sort so the table and the Sort sheet stay in sync — Name ↑,
      Rating ↓, Price toggling ↑/↓, Distance ↑, Status (open first) — with an arrow and
      `aria-sort`.
- [ ] Enable the table icon in `ViewToggle`.

**Responsive (doc phase 10c)**

- [ ] ≥768px: nav becomes a left rail, cards 2-up, quick chips wrap, the filter sheet becomes a
      380px right panel, sort becomes a dropdown.
- [ ] ≥1200px: persistent filter sidebar, cards 3-up, 40/60 list | map split with hover-linked
      pins, full table with no horizontal scroll.

## Implementation notes

- **Picking the winner before the animation is the correct order**, not a shortcut: it lets the
  server weight the choice by usage data and makes the animation purely presentational. Deriving
  the winner from a random final rotation would make weighting impossible.
- The rotation formula's `1800` is five full turns of spin before landing; `360 − (i·seg +
  seg/2)` lands the pointer on the centre of segment `i`. Keep the comment explaining this — it
  is not inferable from the expression.
- Reduced motion must skip to the result, not shorten the animation. A 3.2s spin is exactly the
  kind of motion that triggers vestibular discomfort.
- The table's sticky first column is the whole point of the view — comparison is impossible if
  the name scrolls away. ARIA roles are mandatory because this is divs, not a real `<table>`.
- Table headers write to the same `SearchQuery` as the sort sheet. This is the phase-4 decision
  paying off; if it was violated, this is where it shows.
- Hover-linked map pins at ≥1200px are the first hover-dependent UI in the app. Keep them inside
  `@media (hover: hover)` and ensure touch still works.

## Verify

The wheel lands with the pointer centred on the winning segment every time across 20 spins.
Under `prefers-reduced-motion` the result appears immediately with no rotation. The spin feature
is a separate chunk absent from the initial bundle. In the table the name column stays fixed
while other columns scroll, header taps change the sort and the sort sheet reflects it, and
`aria-sort` is correct. At 768px and 1200px the layouts match the spec with no overflow.

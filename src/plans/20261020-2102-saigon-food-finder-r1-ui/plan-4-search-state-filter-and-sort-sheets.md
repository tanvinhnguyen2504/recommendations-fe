# Phase 4 — Search state, filter and sort sheets

> Doc phase 4 · Release R1 · The architectural keystone of the app.

## Goal

Make one `SearchQuery` the single source of truth for every result view, and drive it from a
full-height filter sheet with a live result count plus a sort sheet.

## Tasks

- [x] `searchStore` holding one `SearchQuery` (shape in `CLAUDE.md` §"Data contracts"), as a Zustand store.
- [ ] Wire quick chips, active chips, `CategoryTabs`, `FilterButton` and `SortButton` to read
      and write that same state — no local copies.
- [ ] `FilterSheet` at 90% height (≈800 of 844px), header "Bộ lọc" + "N đang chọn" + close.
- [ ] Scroll body, one `<fieldset>` per section:
      - Mức giá — 3 tiles ₫ / ₫₫ / ₫₫₫ with VND ranges, multi-select
      - Món ăn — wrap chips with EN hints
      - Không gian quán cà phê — wrap chips
      - Giờ mở cửa — Đang mở / Mở khuya (sau 22:00) / Mở 24h
      - Khoảng cách "Tính từ Võ Văn Tần" — 4-up single-select 500m / 1km / 3km / 5km, tapping
        the selected one clears it
      - Đánh giá tối thiểu — Bất kỳ / 3,5+ / 4,0+ / 4,5+
      - Tiện ích — checkbox rows
- [ ] Sticky footer: "Xóa tất cả" (outline) + "Xem N kết quả" (primary, flex 1), above the safe
      area.
- [ ] Live count: debounce 250ms, `GET /places/count` with the **draft** query; grey the button
      at 0 results.
- [ ] `SortSheet`: 6 rows at 52px — Phù hợp nhất, Gần nhất, Đánh giá cao nhất, Giá thấp → cao,
      Giá cao → thấp, Mới mở. Selected row tinted with a check; choosing one closes the sheet.
- [ ] Shared `BottomSheet` built on `vaul`: drag handle, scrim closing on tap, `role="dialog"`,
      `aria-modal="true"`, focus trap, `overscroll-behavior: contain`, body scroll lock, swipe
      to close, animation under 250ms.
- [ ] Mock `GET /places/count`.

## Implementation notes

- **Filters apply live** (the design does). That makes "Xem N kết quả" a dismiss button, not a
  commit — worth confirming, since apply-on-confirm needs a draft copy and changes this whole
  phase. Logged as open question 6.
- The live count queries the draft query while the list queries the committed one. With live
  apply they are the same object, so the count is just a second query with a different key and
  a debounce — do not build a second state tree for it.
- Debounce the **query value**, not the click handler, or rapid chip taps each fire a request.
- Sheet-only filters (radius, min rating) must still surface in `ActiveFilterRow`, otherwise a
  user who set "Trong 1 km" in the sheet sees an unexplained narrow result set.
- Build `BottomSheet` once here; phases 5, 9 and 11 all reuse it. `vaul` gives drag-to-dismiss
  and scroll locking; the focus trap and ARIA still need checking by hand.
- Body scroll lock must restore the previous scroll position on close — iOS Safari loses it
  when `position: fixed` is applied naively.

## Verify

Toggling a quick chip updates the active chips, the filter button badge and the result count
with no manual synchronisation. Opening the filter sheet shows state matching the chips.
Changing a filter updates "Xem N kết quả" within ~250ms of the last keystroke/tap, and the
button greys at 0. The sheet traps focus, closes on scrim tap and on swipe down, and the page
behind it does not scroll. Sort selection closes the sheet and reorders the list.

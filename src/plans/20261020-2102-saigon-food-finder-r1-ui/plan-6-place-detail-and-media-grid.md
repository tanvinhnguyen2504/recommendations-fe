# Phase 6 — Place detail and media grid

> Doc phase 7 (R1 portion) · Release R1 · The decision-and-go screen.

## Goal

Give the user everything needed to commit to a place and leave for it: photos, hours, address,
and a one-tap route.

## Tasks

- [ ] Route `/place/:id` with no bottom nav.
- [ ] 248px hero: back and heart buttons as 44px white circles, cover caption bottom-left, and a
      "Xem 12 ảnh & video" pill bottom-right.
- [ ] Info block: category pill (+ "Chờ duyệt"), H1 name at 24/800, ★ rating (reviews) ·
      distance · price level, address · ~avg₫/người, open status, non-interactive tag pills.
- [ ] `MediaGallery`: title "Ảnh & video · 12", tabs with counts (Tất cả, Món ăn, Không gian,
      Thực đơn, Video), 3-column grid at 116px rows with 4px gaps, **first tile spanning 2×2**
      when there are ≥3 items.
- [ ] Video tiles get a centred play icon and a duration badge; menu tiles a document icon;
      every tile has a caption.
- [ ] Empty state for pending places: "Chưa có ảnh nào. Bạn là người đầu tiên chia sẻ nhé!"
- [ ] R1 lightbox: tapping a tile opens the image full size in a simple overlay — no thumbnail
      strip (that is the R2 `MediaViewer`).
- [ ] Web Share (`navigator.share`) next to the heart, falling back to copy-link.
- [ ] Sticky bottom bar: "Lưu / Đã lưu" (outline, heart) + "Chỉ đường" (primary), above the
      safe area.
- [ ] "Chỉ đường" opens `https://www.google.com/maps/dir/?api=1&destination=lat,lng`.
- [ ] Lazy-load the gallery below the fold.
- [ ] Mock `GET /places/:id` and its media.

## Implementation notes

- The 2×2 first tile only applies at ≥3 items; with 1–2 items it would leave holes in the grid.
  Use an explicit grid-area rule guarded on count, not a nth-child trick.
- The directions URL is the universal Google Maps intent — on Android and iOS it hands off to
  the native app, on desktop it opens the web map. No SDK, no key, no map library in R1.
- `navigator.share` is unavailable on desktop Safari and in some in-app browsers. Feature-detect
  and fall back to clipboard; never render a button that silently does nothing.
- The sticky bar sits within thumb reach and must clear the safe area — it is the screen's
  primary action and the most likely thing to be tapped one-handed on the street.
- "Lưu" needs a decision for R1: the heart is visible but Saved is an R2 screen (open question
  7). Simplest honest R1 behaviour is local-only persistence with no sync promise.

## Verify

The detail renders from a card tap with the hero, info block and grid. With ≥3 media the first
tile spans 2×2; with 2 the grid has no gaps. Tapping a tile opens the overlay and Esc/back
closes it. "Chỉ đường" opens the native maps app on a real phone. The sticky bar clears the
home indicator on a notched device. A pending place shows the "Chờ duyệt" pill and the empty
media state.

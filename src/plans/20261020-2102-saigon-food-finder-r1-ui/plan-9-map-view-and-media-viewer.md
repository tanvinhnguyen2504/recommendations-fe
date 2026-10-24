# Phase 9 — Map view and media viewer

> Doc phases 6a and 7 (viewer) · Release R2 · The two heaviest R2 features.

## Goal

Answer "what's around me?" spatially, and make the photo gallery properly browsable.

## Tasks

- [ ] Choose the map SDK (MapLibre GL vs Google Maps) and record why.
- [ ] `ResultsMap` as a Discover view mode, sharing the same `SearchQuery` as the card list.
- [ ] Rating pins: pill-shaped, showing the rating; selected pin in `--primary`.
- [ ] A blue "selected location" dot for the user's position.
- [ ] `MapPlaceCard` docked at the bottom — 88px thumb, category, name, ★ · distance · ₫,
      status — opening the detail on tap.
- [ ] A "Danh sách" button to switch back to the list.
- [ ] Enable the map icon in `ViewToggle` and the Map nav item.
- [ ] `MediaViewer`: full-screen dialog on `#0F0B09`, counter "4 / 12" + close.
- [ ] Media fills the remaining height; video gets a play button and progress bar.
- [ ] Caption plus attribution: "Ảnh từ quán · Món ăn" / "Khách chia sẻ · …".
- [ ] Thumbnail strip (selected has a white border, others 55% opacity) and Previous / Next.
- [ ] Keyboard ← / → / Esc and swipe on touch.
- [ ] Replace phase 6's simple overlay with the full viewer; add "Thêm ảnh" upload.
- [ ] Lazy-load the map SDK as its own chunk.

## Implementation notes

- **The map SDK must not enter the initial bundle.** It is the single largest dependency in the
  project and R1's budget is already tight — route-level `React.lazy` plus a dynamic import of
  the SDK itself, verified in the build output as a separate chunk.
- Map and list share one `SearchQuery`, so switching views must never refetch from scratch — the
  query cache should already hold the results.
- Low-end Android is the constraint here (doc 04 flags the map as "slower on low-end phones").
  Cap the rendered pin count and cluster rather than drawing every result.
- The viewer replaces the R1 overlay rather than sitting beside it. Delete the overlay; two
  lightbox paths will drift.
- Reduced motion applies to the thumbnail strip and transitions, not just the spin wheel.

## Verify

The map renders pins for the current filters and the selected pin changes colour. Tapping a pin
raises the place card; tapping the card opens the detail. "Danh sách" returns to the list with
the same results and no refetch. The build output shows the map SDK in a separate chunk and the
initial bundle is unchanged. The viewer navigates by keyboard, swipe and thumbnail, and video
plays with a working progress bar.

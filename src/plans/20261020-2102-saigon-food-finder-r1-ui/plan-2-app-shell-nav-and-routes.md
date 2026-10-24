# Phase 2 — App shell, bottom nav and routes

> Doc phase 2 · Release R1

## Goal

Give every later screen a frame to render in: a full-height shell, a 4-item bottom nav with
only Discover live, and a route table that keeps browsing public.

## Tasks

- [ ] `AppShell`: full-height flex column — content area (`flex-1`, `min-height: 0`) plus
      `BottomNav`.
- [ ] `BottomNav`: 4 items (Khám phá/Discover, Bản đồ/Map, Đã lưu/Saved, Tài khoản/Account),
      icon + 11px label, active state in `--primary` at weight 700 with `aria-current="page"`.
- [ ] Disable Map / Saved / Account in R1 with "Sắp ra mắt / Coming soon"; keep them in the DOM
      so the layout does not shift when R2 enables them.
- [ ] Add routes `/` and `/place/:id`; keep `/login`, `/onboarding`, `*`.
- [ ] Hide `BottomNav` on `/place/:id` (and later `/add`).
- [ ] Move `RequireAuth` so it wraps only `/saved`, `/account`, `/add` — never `/` or
      `/place/:id`.
- [ ] Apply `env(safe-area-inset-bottom)` padding to the nav via
      `max(0.5rem, env(safe-area-inset-bottom))`.
- [ ] Set the root container to fluid width with `max-width: 480px` centred.
- [ ] Replace the auth-era `AppHeader` usage on `/` — Discover brings its own header in phase 3.

## Implementation notes

- `min-height: 0` on the content area is load-bearing: without it a flex child with scrolling
  content refuses to shrink and the nav gets pushed off-screen.
- The nav's Map item selects the **Discover screen in map view** rather than navigating to a
  `/map` route, because the view toggle and the map share one `SearchQuery`.
- Do not hard-code 390px anywhere. The design targets 390×844 but must survive 360–430px.
- `min-h-dvh`, never `100vh` — the iOS Safari toolbar changes viewport height mid-scroll.
- Keep `/login` outside the gate, as it already is. The one real change here is that `/` leaves
  the gate, which is a scope decision, not a refactor: browsing must not require sign-in.

## Verify

Nav renders at 360px without wrapping or overflow; disabled items are announced as disabled.
Visiting `/` while signed out shows Discover, not a redirect to `/login`. Visiting `/saved`
while signed out still redirects. `/place/:id` renders with no bottom nav. Safe-area padding is
visible in the iOS simulator on a notched profile.

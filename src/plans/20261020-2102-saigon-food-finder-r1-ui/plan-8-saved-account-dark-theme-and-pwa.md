# Phase 8 — Saved, Account, dark theme, PWA

> Doc phase 10b · Release R2 · Cheapest R2 phase; do it first.

## Goal

Turn a one-session tool into something people come back to: saved places, settings that
persist, a dark theme, and an installable offline-capable app.

## Tasks

- [ ] `SavedScreen` at `/saved`: title, "N quán đã lưu", the card list, or an empty hint.
- [ ] Enable the Saved nav item; resolve how R1's local hearts migrate to server-side saves.
- [ ] `AccountScreen` at `/account`: guest card + "Đăng nhập"; settings rows for Ngôn ngữ ·
      Language (Tiếng Việt | English), Giao diện (Sáng | Tối), Vị trí mặc định (opens the
      location sheet); a "Đóng góp" section with "Thêm quán mới" and a pending count.
- [ ] Activate the dark palette defined in phase 1 and audit every screen in it.
- [ ] Persist the explicit theme choice so it wins over `prefers-color-scheme`.
- [ ] Persist language and default location.
- [ ] Add `vite-plugin-pwa`: manifest, icons, install prompt.
- [ ] Service worker caching the app shell, area/ward/street reference data and saved places.
- [ ] Offline banner when the SW reports no connectivity.

## Implementation notes

- This phase is where auth stops being decorative: Saved needs an identity. The existing cookie
  session already works — wire `useMe` into the guest card rather than building anything new.
- Dark mode is a **behaviour change** from the auth era, which followed `prefers-color-scheme`
  with no toggle. `defaultTheme="system"` stays the default, but an explicit choice must now
  persist and override the media query.
- Dark values were defined in phase 1 but never rendered. Expect contrast failures in the
  terracotta `--primary` (`#E8906A` on `#221A15`) — re-check AA on buttons and chips, not just
  body text.
- Never persist auth state to `localStorage` — that rule survives from the auth era. Theme,
  language and default location are fine; session data is not.
- Cache reference data deliberately: ward/street lists are large, static and exactly what makes
  the location sheet usable offline.

## Verify

A saved place survives a reload and appears on `/saved`. Choosing Tối keeps the app dark after a
restart even when the OS is light. Every R1 screen passes AA contrast in dark. The app installs
to the home screen on Android and iOS and opens the cached shell with the network disabled, with
the offline banner showing.

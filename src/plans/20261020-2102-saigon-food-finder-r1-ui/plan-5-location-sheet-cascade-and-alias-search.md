# Phase 5 — Location sheet: cascade and old-name search

> Doc phase 5 · Release R1 · Solves a real 2025 HCMC pain point.

## Goal

Let a user say *where* three ways — by browsing area → ward → street, by searching (including
by a **former** ward name), or by using their current location.

## Tasks

- [ ] `LocationSheet` at 772px with the shared `BottomSheet`.
- [ ] Search input "Tìm quận, phường, tên đường…" with the hint
      `Tìm được cả tên cũ, ví dụ "Phường Võ Thị Sáu"`.
- [ ] "Dùng vị trí hiện tại" button (tinted) → Geolocation API → reverse lookup.
- [ ] "Gần đây" horizontal chips with a clock icon, from the user's recent locations.
- [ ] Breadcrumb `Quận 3 › Phường Xuân Hòa › Võ Văn Tần`, each crumb jumping back to its level.
- [ ] Level tabs `1 Khu vực · 2 Phường · 3 Gần đường…`; active tab gets a primary underline and
      a filled number badge; a hint line under the tabs explains each level.
- [ ] Cascade lists: areas show "N phường mới · chọn để xem"; wards show
      "Tên cũ: Phường Võ Thị Sáu"; streets show the popular streets in that ward. Selected row
      is tinted with a check, others show a chevron.
- [ ] Search mode: one mixed Area / Ward / Street result list. A ward matched via an **old name**
      gets a green "Tên mới" badge and a "Tên cũ: … · Quận 3" line.
- [ ] Diacritic-insensitive matching through `normalizeVi`, server-side via
      `GET /locations/search?q=`.
- [ ] Footer: "Xem quán ở khu vực này", writing `area_id`/`ward_id`/`street_id` into `SearchQuery`.
- [ ] Mock `GET /locations/search` and the cascade endpoints with alias data.

## Implementation notes

- **Autofocus the search input only when the sheet was opened from search.** Opening from the
  location chip must show the cascade first, or the keyboard covers the list immediately.
- The whole point of alias search is that HCMC's 2025 ward merges renamed wards people still
  refer to by the old name. The "Tên mới" badge is the payoff — it tells the user *why* an
  unfamiliar name matched their familiar query. Do not drop it as decoration.
- Matching is server-side, but `normalizeVi` still runs client-side for the recent-locations
  chips and for optimistic highlighting.
- Geolocation requires HTTPS and must fire **only** on tap, never on mount. Handle all three
  failure modes — denied, unavailable, timeout — by falling back to the cascade with a message,
  not a dead sheet.
- Selecting a level must clear deeper levels: picking a new ward invalidates the chosen street,
  or `SearchQuery` ends up with a street in the wrong ward.
- Needs area → ward → street reference data with aliases, which may not exist yet (open
  question 5). Mock it with real Quận 3 names so the UI is honest about shape.

## Verify

Typing "Phường Võ Thị Sáu" returns the current ward with a "Tên mới" badge and its old name.
Typing "phuong vo thi sau" (no diacritics) returns the same row. The breadcrumb navigates back
and clears deeper selections. "Dùng vị trí hiện tại" prompts only on tap and degrades to the
cascade when denied. The footer writes the selection into `SearchQuery` and the Discover count
updates.

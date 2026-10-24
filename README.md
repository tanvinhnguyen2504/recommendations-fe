# Saigon Food & Coffee Finder — Build Docs

Docs derived from the design canvas **"Saigon Food & Coffee Finder"** (21 artboards, 390×844, VI/EN, light/dark).

| # | File | Use it for |
|---|------|-----------|
| 1 | `01-implementation-prompt.md` | Paste into an AI coding assistant (or hand to a developer) to build the UI, phase by phase |
| 2 | `02-component-breakdown.md` | Component tree, props, state ownership, design tokens, i18n keys |
| 3 | `03-database-analysis.md` | Entities, ERD, PostgreSQL schema, indexes, key queries, moderation and recommendation data |
| 4 | `04-mobile-screen-priority.md` | Mobile-web (PWA) screen ranking, R1/R2/R3 release slices, phone-specific rules, sprint plan |

## Screen inventory (from the canvas)

| Row | Artboard | Screen / state |
|-----|----------|----------------|
| 1 | Main, HomeEN | Discover home, 3 active filters + "Highest rated" sort, VI and EN |
| 1 | FilterVI, FilterEN | Full-height filter sheet, VI and EN |
| 2 | Location, LocationSearch | Location sheet: 3-level cascade; search by old ward name |
| 2 | Sort | Sort sheet |
| 2 | Table | Compact table view (sticky Name column, sortable headers) |
| 2 | Map | Map view with rating pins and a selected-place card |
| 3 | Empty, Loading | No-results state; skeleton loading |
| 3 | Account | Account tab: language + theme switches, contribute entry |
| 3 | HomeDark, FilterDark | Dark theme |
| 4 | Detail, DetailViewer | Place detail with media gallery; full-screen media viewer |
| 4 | AddPlace, AddDone | Add-a-place form with duplicate check; submitted state |
| 4 | Spin, SpinResult, SpinArea | Lucky spin: place mode, winner, random-area mode |

## Build order (mobile web first; details in `04-mobile-screen-priority.md`)

- **R1, MVP "find a place near me":**
  - foundations, shell, Discover cards;
  - filter, sort and location sheets;
  - place detail with the media grid;
  - loading and empty states;
  - VI/EN toggle.
- **R2, "come back and contribute":**
  - Saved, Account, dark theme;
  - map view, media viewer;
  - add a place with moderation;
  - PWA install and offline.
- **R3, "delight and power":**
  - lucky spin, table view;
  - tablet and desktop layouts.

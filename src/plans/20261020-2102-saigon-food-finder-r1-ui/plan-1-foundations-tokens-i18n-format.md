# Phase 1 — Foundations: tokens, i18n, formatting

> Doc phase 1 · Release R1 · Nothing else can start until this lands.

## Goal

Put the terracotta palette, bilingual plumbing and locale-aware formatting in place so no
later phase ever hard-codes a colour, a string or a number format.

## Tasks

- [ ] Map the 15 design tokens onto Tailwind 4 CSS variables in `src/index.css`, light theme
      first, dark values defined but unused until R2.
- [ ] Retokenise `src/components/ui/` to the new variables — change variable *values*, not
      component structure, so the shadcn CLI stays usable.
- [ ] Add radii (chips 999px, inputs/buttons 12–14px, cards 16px, sheets 22px top), the warm
      shadow `0 6px 18px rgba(60,35,20,.08)`, the 4/8/12/16/20/24 spacing scale and 15px/1.4
      body type.
- [ ] Install `i18next` + `react-i18next`; create `vi` (default) and `en` resource files and a
      provider in `main.tsx`.
- [ ] Write `src/lib/format.ts`: `formatVnd`, `formatDecimal`, `formatDistance`, `formatTime`,
      `formatCount` — each locale-aware.
- [ ] Write `src/lib/normalize.ts`: `normalizeVi(s)` → lower-case, NFD diacritic strip, `đ`→`d`.
- [ ] Unit-test every helper in both locales.
- [ ] Assemble the icon set from `lucide-react`: pin, chevron (down/right/left), search,
      sliders, sort, x, check, heart, star, cards, table, map, compass, bookmark, user, locate,
      clock, image, play, file-text, menu, plus, dice, navigation, grid.
- [ ] Convert `lib/errors.ts`'s `ERROR_MESSAGES` from English literals to i18n keys.
- [ ] Build a `/dev/tokens` preview page rendering both themes and all tokens.

## Implementation notes

- Tailwind 4 is CSS-first — there is no `tailwind.config.ts`. Tokens are `@theme` variables in
  `index.css`, so `--primary` is usable as `bg-primary` without a JS config.
- Keep next-themes writing the `.dark` **class**, not `data-theme`. The generated `radix-nova`
  variant expects `.dark`; switching costs a full regeneration for zero visual gain.
- `formatTime` takes a `'HH:mm'` string from the API, not a `Date` — the API returns opening
  hours as wall-clock strings with no timezone, and constructing a `Date` would invent one.
- VI decimal separator is a comma, which is also the thousands separator in EN. Use
  `Intl.NumberFormat` with the correct locale rather than string replacement.
- `normalizeVi` must strip diacritics via `normalize('NFD')` + combining-mark removal, but `đ`
  is **not** a diacritic composition — it needs an explicit replacement before or after.
- Icons are stroke, 24px grid, round caps, 1.8–2px. **No emoji anywhere in the UI.**
- The empty `ERROR_MESSAGES` ⇄ i18n switch must keep `readErrorCode`'s behaviour: an unmodelled
  code still degrades to `INTERNAL` rather than rendering a missing key.

## Verify

```bash
pnpm test        # format + normalize suites green, both locales
pnpm typecheck
pnpm dev         # /dev/tokens renders every token in light and dark
```

`normalizeVi('Phường Võ Thị Sáu') === 'phuong vo thi sau'` passes. Switching the i18n locale
at runtime re-renders the preview page with no reload and no missing-key warnings in console.

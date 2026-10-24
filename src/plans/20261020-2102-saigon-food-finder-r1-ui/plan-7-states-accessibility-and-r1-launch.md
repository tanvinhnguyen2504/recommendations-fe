# Phase 7 — States, accessibility, performance: R1 launch gate

> Doc phase 10a · Release R1 · This phase is the launch gate, not a polish pass.

## Goal

Close every dead end, meet the accessibility and performance budgets, and prove the R1 flow on
real devices.

## Tasks

- [ ] `EmptyState`: cup icon in a tint circle, "Chưa có quán nào khớp", helper text, "Mở rộng
      lên 3 km" (primary), "Xóa tất cả" (outline), and an add-a-place link.
- [ ] `LoadingState`: skeleton count bar + 3 skeleton cards using `--skel`; no shimmer required,
      and any shimmer must respect `prefers-reduced-motion`.
- [ ] End-of-list state so infinite scroll terminates visibly rather than just stopping.
- [ ] Error state for a failed results query, distinct from empty — "no matches" and "request
      failed" are different problems and must not share copy.
- [ ] Accessibility pass: `aria-label` on every icon-only button, `aria-pressed` on toggles,
      `role="tab"`/`aria-selected` on tabs, focus trap in all sheets, logical tab order, AA
      contrast in light theme.
- [ ] Run axe on Discover, both sheets, the location sheet and the detail; fix all serious
      violations.
- [ ] Performance: measure, then get initial JS under 170 KB gzipped.
- [ ] Responsive images: `srcset` + WebP/AVIF with blurhash placeholders.
- [ ] Verify every screen at 360 / 375 / 390 / 430px in VI and EN.
- [ ] Real-device QA: iOS Safari (latest, latest-1) and mid-range Android Chrome — keyboard open
      in every input, safe areas on a notched phone, landscape, 4G throttling.
- [ ] Confirm no hard-coded copy remains anywhere in components.

## Implementation notes

- **The bundle is already 183 KB gzipped with no product code in it.** This is a real conflict
  with the 170 KB budget, not a rounding error (open question 3). Likely wins: drop unused
  shadcn primitives (several of the 15 are unused), audit `lucide-react` imports for
  tree-shaking, and check whether `cn` and `shadcn` belong in `dependencies` at all.
- Measure with the actual command, never estimate:
  `pnpm build && gzip -c dist/assets/index-*.js | wc -c` — under 174,080 bytes.
- The empty state's "Mở rộng lên 3 km" must actually widen `radius_m` in `SearchQuery` and
  refetch. An empty state offering an action that does nothing is worse than none.
- Grep for VI diacritics in `src/components` and `src/pages` as the no-hard-coded-copy check;
  only i18n resource files should match.
- EN strings run ~30% longer than VI in places. Test EN at 360px specifically — it is the
  overflow case, not VI.

## Verify

```bash
pnpm typecheck && pnpm test
pnpm build && gzip -c dist/assets/index-*.js | wc -c   # < 174080
```

Every `plan.md` success criterion holds. axe reports no serious violations on the five R1
surfaces. The full flow — open → location → browse → filter → sort → detail → directions —
completes on a physical iPhone and a physical Android with no dead ends, in both locales.
**R1 ships here.**

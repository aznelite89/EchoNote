# Changelog

## 2026-03-21

### Fixed
- Production builds use SSR-safe Framer entrances (`MotionEntrance`); dev entrance wrappers use `initial={false}` so prerendered UI is visible under `pnpm dev` (avoids `opacity: 0` HTML until JS)
- `BottomSheet` duplicate `style` prop merged so `bottom` is not dropped

### Added
- `lib/motion-policy.ts`, `lib/hooks/use-hydrated.ts`, `components/motion-entrance.tsx`
- Cursor project rule to use pnpm instead of npm for package management
- `.gitignore` entries for pnpm debug logs and local store dirs (`.pnpm-store/`, `pnpm_store/`)

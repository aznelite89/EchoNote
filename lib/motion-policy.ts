/**
 * Production: visible-first HTML + post-mount Framer entrance (avoids `opacity: 0` in SSR).
 * Development: entrance wrappers use `initial={false}` so prerendered HTML stays visible if
 * hydration is slow; Framer still animates after mount. (Classic `initial={{ opacity: 0 }}` in
 * dev SSR can look “blank” until JS runs.)
 */
export const MOTION_SSR_SAFE = process.env.NODE_ENV === "production"

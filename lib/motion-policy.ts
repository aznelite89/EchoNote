/**
 * When true (production / Vercel): classic Framer `initial` + `animate` entrance on auth & home.
 * When false (`pnpm dev`): same blocks use `initial={false}` so the login/home shell is visible
 * without entrance motion (avoids `opacity: 0` in prerendered HTML).
 */
export const MOTION_SSR_SAFE = process.env.NODE_ENV === "production"

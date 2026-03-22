# Changelog

## 2026-03-22

### Fixed

- Mobile FPS: `home-screen.tsx` — made ambient gradient orbs static (removed `repeat: Infinity` + `blur-3xl` animation); recording pulse uses opacity-only animation with `blur-2xl`
- Mobile FPS: `waveform.tsx` — animate `scaleY` instead of `height` (GPU-composited, no layout thrashing); reduced from 40 to 20 bars with 4px width
- Mobile FPS: `record-button.tsx` — replaced animated `boxShadow` keyframes with static shadow + opacity-only animation

### Added

- `@reduxjs/toolkit`, `react-redux`, `redux-saga`, `immutable` — client Redux store (`makeStore`), `slices/*` (`createSlice` + Immutable `fromJS` / `merge` reducers), `sagas/*` (session, common, recordings), `store/root-state.ts` / `store/hooks.ts`, `components/redux-provider.tsx` wrapping the app in `app/layout.tsx`
- `lib/api.ts` — `apiGetMe()` calls `GET /users/me` to fetch authenticated user profile

### Changed

- `slices/sessionSlice.ts` — expanded state with `user`, `accessToken`, `refreshToken`; replaced `setIsAuthenticated` with `loginSuccess`, `logout`, `setTokens`, `restoreSession` actions; tokens persisted to localStorage in reducers
- `sagas/sessionSaga.ts` — handles `loginSuccess` (fetch recordings), `logout` (clear recordings), `restoreSession` (read token from localStorage → `GET /users/me` → restore or logout)
- `components/auth-screens.tsx` — dispatches `loginSuccess` directly to Redux instead of `onAuthSuccess` callback; removed `onAuthSuccess` prop
- `components/profile-screen.tsx` — reads user from Redux via `useAppSelector`; displays real name, email, initials, and plan instead of hardcoded "John Doe"
- `app/page.tsx` — dispatches `restoreSession` on mount and `logout` on sign out; removed `handleAuthSuccess` callback

### Changed

- `slices/*` — `createSlice` with `fromJS` / `state.merge(fromJS({…}))` (and list helpers in `recordingsSlice`) instead of `createAction` + switch-style reducers
- `app/page.tsx` — auth, tab, recordings, selection, and title/delete flows use `useAppDispatch` / `useAppSelector`; list fetch on login/logout and API side effects run through sagas
- `app/page.tsx`, `app/layout.tsx`, and custom `components/*` (excluding `components/ui/*`) — arrow function components with default exports; imports grouped (React → libraries → `@/` → relative)
- `components/ui/*` — `function` declarations converted to `const … = (…) =>` / `export const …` (named exports unchanged); `toaster.tsx` uses an arrow in `toasts.map`
- `scripts/convert-ui-to-arrows.mjs` — one-off helper to rewrite statement-start `function`/`export function` in `components/ui` (skips callbacks after `.map(`-style line breaks)

### Fixed

- `components/home-screen.tsx` — exported `HomeScreenProps` with required `liveTranscript` and async-friendly `onRecordToggle` / `onRecordingDelete` types
- `components/recording-card.tsx` — swipe delete prop renamed to `onRecordingDelete` (exported `RecordingCardProps`); matches `HistoryScreen` / `BottomSheet` and accepts async handlers
- `types/recording.ts` — `Recording.status` is required (exported `RecordingStatus`); `lib/recording-api.ts` defaults missing `status` to `"ready"` after fetch

### Added

- `lib/recording-api.ts` — `apiUpdateRecordingTitle()` calls `PATCH /recordings/:id` with JSON `{ title }`
- `components/summary-screen.tsx` — pencil opens title edit with focused shadcn `Input`; green check saves and trash cancels; updates list via `onTitleChange`
- `lib/recording-api.ts` — `apiListRecordings()` fetches recordings from `GET /recordings` with normalization
- `lib/recording-api.ts` — `apiDeleteRecording()` calls `DELETE /recordings/:id`
- `components/recording-card.tsx` — swipe-left-to-delete with red trash button using Framer Motion drag

### Fixed

- `lib/recording-api.ts` — auto-redirect to login on 401 (expired/invalid token); clears stored tokens and reloads page
- `app/page.tsx` — persist auth state across page refresh by reading `accessToken` from `localStorage` on mount; clear tokens on logout
- `lib/recording-api.ts` — format ISO timestamp from API into friendly format ("Today, 11:59 AM" / "Yesterday, 3:00 PM" / "Mar 22, 11:59 AM")

### Changed

- `app/page.tsx` — saving an edited recording title calls `apiUpdateRecordingTitle`; optimistic UI with rollback and toast on failure
- `app/page.tsx` — replaced hardcoded sample recordings with `apiListRecordings()` fetch on mount; recordings persist across page refresh

### Changed

- `hooks/use-recorder.ts` — replaced WebSocket + AudioContext PCM streaming with browser-native Web Speech API (`webkitSpeechRecognition`) for instant live transcript (~100ms latency); on stop, uploads audio blob via `POST /recordings` then polls `GET /recordings/:id` every 2s until Whisper processing completes; auto-restarts recognition on silence/network errors; 60s polling timeout

### Added

- `lib/recording-api.ts` — `apiCreateRecording` (multipart upload) and `apiGetRecording` (fetch by id)
- `types/recording.ts` — added `status`, `transcript`, `durationFormatted` optional fields

### Changed

- `app/page.tsx` — replaced simulated recording state/timer/toggle with `useRecorder` hook; recordings list is now mutable and prepends new recordings when they arrive
- `components/home-screen.tsx` — `liveTranscript` prop wired into the transcription preview area; shows "Listening..." before first words arrive

### Added

- `lib/api.ts` — `apiFetch` wrapper with JWT header; exports `apiLogin` (`POST /auth/login`) and `apiRegister` (`POST /auth/register`)
- `types/user.ts` — `User` and `TokenPair` interfaces matching EchoNote-api spec

### Changed

- `components/auth-screens.tsx` — wired real API calls (`apiLogin`/`apiRegister`); stores tokens in `localStorage` on success; shows `toast.error` on failure; social login shows "not supported yet" toast; `<Toaster>` mounted inside the component

### Changed

- Production: classic Framer `initial`/`animate` on auth + home (removed `MotionEntrance`); dev uses `initial={false}` on those shells for no entrance motion

### Removed

- `components/motion-entrance.tsx`
- `lib/hooks/use-hydrated.ts` (unused)

## 2026-03-21

### Changed

- Production: restored full `EchoNoteLogo` intro on Vercel (`runIntro = animated && MOTION_SSR_SAFE`); auth echo rings use a slow opacity/scale pulse

### Fixed

- Dev login/home shells use `initial={false}` so prerendered UI is visible under `pnpm dev`
- `BottomSheet` duplicate `style` prop merged so `bottom` is not dropped

### Added

- `lib/motion-policy.ts`
- Cursor project rule to use pnpm instead of npm for package management
- `.gitignore` entries for pnpm debug logs and local store dirs (`.pnpm-store/`, `pnpm_store/`)

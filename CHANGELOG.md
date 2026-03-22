# Changelog

## 2026-03-22

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

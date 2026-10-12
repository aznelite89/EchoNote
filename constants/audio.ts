// Recording encoding settings. Speech stays clear at 32 kbps mono Opus,
// which keeps a 30-minute meeting around 7 MB — well under Whisper's 25 MB limit.
export const RECORDING_AUDIO_BITS_PER_SECOND = 32_000
export const RECORDING_CHANNEL_COUNT = 1

// Preferred container/codec, in order; the first one the browser supports is used.
export const RECORDING_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/ogg;codecs=opus",
  "audio/mp4",
] as const

export const DEFAULT_RECORDING_MIME_TYPE = "audio/webm"

// Upload filename extension per container — Whisper detects format from the extension.
export const RECORDING_FILE_EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
}

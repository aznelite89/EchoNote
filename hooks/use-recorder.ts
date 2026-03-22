"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { apiCreateRecording, apiGetRecording } from "@/lib/recording-api"
import type { Recording } from "@/types/recording"

// ── SpeechRecognition type shim (vendor-prefixed in Chrome/Edge/Safari) ──
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

function createSpeechRecognition(): SpeechRecognitionInstance | null {
  const W = window as unknown as Record<string, unknown>
  const Ctor = (W.SpeechRecognition ?? W.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionInstance)
    | undefined
  return Ctor ? new Ctor() : null
}

// ── Polling constants ────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 60000

// ── Hook ─────────────────────────────────────────────────────────────────
export interface RecorderState {
  isRecording: boolean
  isProcessing: boolean
  recordingTime: string
  liveTranscript: string
  latestRecording: Recording | null
  toggleRecording: () => Promise<void>
}

export function useRecorder(): RecorderState {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState("00:00")
  const [liveTranscript, setLiveTranscript] = useState("")
  const [latestRecording, setLatestRecording] = useState<Recording | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secondsRef = useRef(0)
  const durationRef = useRef(0)
  const finalTranscriptRef = useRef("")
  const isRecordingRef = useRef(false) // stable ref for callbacks
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Cleanup ─────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (pollRef.current) clearInterval(pollRef.current)
    recognitionRef.current?.abort()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    mediaRecorderRef.current = null
    recognitionRef.current = null
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  // ── Poll for recording status ───────────────────────────────────────────
  const pollRecording = useCallback(
    (recordingId: string) => {
      const startedAt = Date.now()

      pollRef.current = setInterval(async () => {
        try {
          const rec = await apiGetRecording(recordingId)

          if (rec.status === "ready") {
            if (pollRef.current) clearInterval(pollRef.current)
            setLatestRecording(rec)
            setIsProcessing(false)
          } else if (rec.status === "error") {
            if (pollRef.current) clearInterval(pollRef.current)
            toast.error("Recording processing failed")
            setIsProcessing(false)
          } else if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
            if (pollRef.current) clearInterval(pollRef.current)
            toast.error("Processing timed out")
            setIsProcessing(false)
          }
        } catch {
          // Network error during poll — keep trying until timeout
          if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
            if (pollRef.current) clearInterval(pollRef.current)
            toast.error("Processing timed out")
            setIsProcessing(false)
          }
        }
      }, POLL_INTERVAL_MS)
    },
    []
  )

  // ── Start recording ─────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setLiveTranscript("")
    finalTranscriptRef.current = ""
    chunksRef.current = []
    secondsRef.current = 0
    durationRef.current = 0
    setRecordingTime("00:00")

    // 1. Microphone access
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      toast.error("Microphone access denied")
      return
    }
    streamRef.current = stream

    // 2. MediaRecorder — collect audio blob for upload
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    mediaRecorder.start(500)
    mediaRecorderRef.current = mediaRecorder

    // 3. Web Speech API — instant live transcript
    const recognition = createSpeechRecognition()
    if (recognition) {
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ""
        let final = ""
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            final += result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }
        finalTranscriptRef.current = final
        setLiveTranscript(final + (interim ? interim : ""))
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Auto-restart on recoverable errors while still recording
        if (
          isRecordingRef.current &&
          (event.error === "no-speech" ||
            event.error === "network" ||
            event.error === "aborted")
        ) {
          try { recognition.start() } catch { /* already running */ }
        }
      }

      recognition.onend = () => {
        // Auto-restart if recording is still active (browser stops after silence)
        if (isRecordingRef.current) {
          try { recognition.start() } catch { /* already running */ }
        }
      }

      recognition.start()
      recognitionRef.current = recognition
    }

    // 4. Timer
    timerRef.current = setInterval(() => {
      secondsRef.current += 1
      durationRef.current = secondsRef.current
      setRecordingTime(formatTime(secondsRef.current))
    }, 1000)

    isRecordingRef.current = true
    setIsRecording(true)
  }, [])

  // ── Stop recording ──────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    isRecordingRef.current = false
    setIsRecording(false)
    setIsProcessing(true)

    // Stop speech recognition
    recognitionRef.current?.stop()

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current)

    // Stop MediaRecorder → upload blob
    const mr = mediaRecorderRef.current
    if (mr && mr.state !== "inactive") {
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        })

        try {
          const rec = await apiCreateRecording(
            blob,
            "New Recording",
            "meeting",
            durationRef.current
          )
          // Start polling for backend Whisper processing
          pollRecording(rec.id)
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Failed to upload recording"
          )
          setIsProcessing(false)
        }
      }
      mr.stop()
    } else {
      setIsProcessing(false)
    }

    // Release mic
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [pollRecording])

  // ── Toggle ──────────────────────────────────────────────────────────────
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return {
    isRecording,
    isProcessing,
    recordingTime,
    liveTranscript,
    latestRecording,
    toggleRecording,
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

import type { Recording } from "@/types/recording"
import { RECORDING_FILE_EXTENSIONS } from "@/constants/audio"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1"

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return iso

  const now = new Date()
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })

  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return `Today, ${time}`

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`

  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`
}

function recordingFileExtension(mimeType: string): string {
  const container = mimeType.split(";")[0].trim()
  const ext = RECORDING_FILE_EXTENSIONS[container]
  if (!ext) throw new Error(`Unsupported recording format: ${mimeType || "unknown"}`)
  return ext
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function normalizeRecordingFields(
  rec: Recording & { durationFormatted?: string }
): Recording {
  if (rec.durationFormatted) rec.duration = rec.durationFormatted
  if (rec.timestamp) rec.timestamp = formatTimestamp(rec.timestamp)
  if (!rec.status) rec.status = "ready"
  return rec
}

function handleUnauthorized(res: Response): void {
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    window.location.reload() // reload triggers restoreSession → finds no token → shows login
  }
}

export async function apiCreateRecording(
  blob: Blob,
  title: string,
  type: string,
  durationSecs: number
): Promise<Recording> {
  const form = new FormData()
  form.append("audio", blob, `recording.${recordingFileExtension(blob.type)}`)
  form.append("title", title)
  form.append("type", type)
  form.append("duration", String(Math.round(durationSecs)))

  const res = await fetch(`${BASE_URL}/recordings`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  })

  if (!res.ok) {
    handleUnauthorized(res)
    const body = await res.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(body.error ?? "Upload failed")
  }

  const rec: Recording & { durationFormatted?: string } = await res.json()
  return normalizeRecordingFields(rec)
}

export async function apiListRecordings(limit = 20): Promise<Recording[]> {
  const res = await fetch(`${BASE_URL}/recordings?limit=${limit}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  })

  if (!res.ok) {
    handleUnauthorized(res)
    return []
  }

  const body: { recordings: (Recording & { durationFormatted?: string })[] } = await res.json()
  return (body.recordings ?? []).map((rec) => normalizeRecordingFields(rec))
}

export async function apiUpdateRecordingTitle(id: string, title: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/recordings/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  })

  if (!res.ok) {
    handleUnauthorized(res)
    const body = await res.json().catch(() => ({ error: "Update failed" }))
    throw new Error(body.error ?? "Update failed")
  }
}

export async function apiDeleteRecording(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/recordings/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })

  if (!res.ok) {
    handleUnauthorized(res)
    const body = await res.json().catch(() => ({ error: "Delete failed" }))
    throw new Error(body.error ?? "Delete failed")
  }
}

export async function apiGetRecording(id: string): Promise<Recording> {
  const res = await fetch(`${BASE_URL}/recordings/${id}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  })

  if (!res.ok) {
    handleUnauthorized(res)
    const body = await res.json().catch(() => ({ error: "Fetch failed" }))
    throw new Error(body.error ?? "Fetch failed")
  }

  const rec: Recording & { durationFormatted?: string } = await res.json()
  return normalizeRecordingFields(rec)
}

export interface Insights {
  totalRecordings: number
  totalDurationSecs: number
  durationFormatted: string
  totalActionItems: number
  completedActions: number
  thisWeekCount: number
  avgConfidence: number
  recordingsByType: Record<string, number>
  weeklyActivity: { date: string; count: number }[]
  recordingsChange: number
  durationChange: number
  actionItemChange: number
  thisWeekChange: number
}

export async function apiGetInsights(): Promise<Insights> {
  const res = await fetch(`${BASE_URL}/insights`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  })

  if (!res.ok) {
    handleUnauthorized(res)
    const body = await res.json().catch(() => ({ error: "Failed to fetch insights" }))
    throw new Error(body.error ?? "Failed to fetch insights")
  }

  return res.json()
}

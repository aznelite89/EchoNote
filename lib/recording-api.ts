import type { Recording } from "@/types/recording"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1"

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiCreateRecording(
  blob: Blob,
  title: string,
  type: string,
  durationSecs: number
): Promise<Recording> {
  const form = new FormData()
  form.append("audio", blob, "recording.webm")
  form.append("title", title)
  form.append("type", type)
  form.append("duration", String(Math.round(durationSecs)))

  const res = await fetch(`${BASE_URL}/recordings`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(body.error ?? "Upload failed")
  }

  const rec: Recording & { durationFormatted?: string } = await res.json()
  // Normalise: API returns duration as seconds integer; map durationFormatted → duration
  if (rec.durationFormatted) rec.duration = rec.durationFormatted
  return rec
}

export async function apiGetRecording(id: string): Promise<Recording> {
  const res = await fetch(`${BASE_URL}/recordings/${id}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Fetch failed" }))
    throw new Error(body.error ?? "Fetch failed")
  }

  const rec: Recording & { durationFormatted?: string } = await res.json()
  if (rec.durationFormatted) rec.duration = rec.durationFormatted
  return rec
}

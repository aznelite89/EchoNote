export type RecordingStatus =
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "ready"
  | "error"

export interface Recording {
  id: string
  title: string
  summary: string
  duration: string          // display string e.g. "45:32"
  durationFormatted?: string
  timestamp: string
  type: "meeting" | "call" | "interview" | "chat"
  /** Present on API payloads; default when missing (e.g. cached UI state). */
  status: RecordingStatus
  transcript?: string
  keyPoints?: string[]
  actionItems?: ActionItem[]
  highlights?: string[]
  confidence?: number
}

export interface ActionItem {
  id: string
  text: string
  completed: boolean
  assignee?: string
}

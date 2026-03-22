export interface Recording {
  id: string
  title: string
  summary: string
  duration: string          // display string e.g. "45:32"
  durationFormatted?: string
  timestamp: string
  type: "meeting" | "call" | "interview" | "chat"
  status?: "uploading" | "transcribing" | "summarizing" | "ready" | "error"
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

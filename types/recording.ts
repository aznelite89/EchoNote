export interface Recording {
  id: string
  title: string
  summary: string
  duration: string
  timestamp: string
  type: "meeting" | "call" | "interview" | "chat"
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

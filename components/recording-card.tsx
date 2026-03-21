"use client"

import { motion } from "framer-motion"
import { Video, Phone, Users, MessageSquare } from "lucide-react"
import type { Recording } from "@/types/recording"

interface RecordingCardProps {
  recording: Recording
  onClick: () => void
}

const typeIcons = {
  meeting: Video,
  call: Phone,
  interview: Users,
  chat: MessageSquare,
}

export function RecordingCard({ recording, onClick }: RecordingCardProps) {
  const Icon = typeIcons[recording.type]

  return (
    <motion.button
      onClick={onClick}
      className="w-full rounded-2xl bg-card/60 p-4 text-left backdrop-blur-sm border border-border/30 transition-colors hover:bg-card/80"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-medium truncate">
            {recording.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {recording.summary}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{recording.duration}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>{recording.timestamp}</span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

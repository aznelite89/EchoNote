"use client"

import { useRef } from "react"
import { motion, useMotionValue, useTransform, useAnimationControls, type PanInfo } from "framer-motion"
import { Video, Phone, Users, MessageSquare, Trash2 } from "lucide-react"
import type { Recording } from "@/types/recording"

export interface RecordingCardProps {
  recording: Recording
  onClick: () => void
  onRecordingDelete?: (id: string) => void | Promise<void>
}

const typeIcons = {
  meeting: Video,
  call: Phone,
  interview: Users,
  chat: MessageSquare,
}

const DELETE_WIDTH = 80
const SNAP_THRESHOLD = -50

const RecordingCard = ({
  recording,
  onClick,
  onRecordingDelete,
}: RecordingCardProps) => {
  const Icon = typeIcons[recording.type]
  const x = useMotionValue(0)
  const controls = useAnimationControls()
  const isOpenRef = useRef(false)
  const deleteOpacity = useTransform(x, [-DELETE_WIDTH, -30, 0], [1, 0.5, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < SNAP_THRESHOLD) {
      controls.start({ x: -DELETE_WIDTH })
      isOpenRef.current = true
    } else {
      controls.start({ x: 0 })
      isOpenRef.current = false
    }
  }

  const handleClick = () => {
    if (isOpenRef.current) {
      controls.start({ x: 0 })
      isOpenRef.current = false
      return
    }
    onClick()
  }

  const handleDelete = () => {
    void onRecordingDelete?.(recording.id)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete button behind the card */}
      {onRecordingDelete && (
        <motion.button
          className="absolute right-0 top-0 bottom-0 flex w-20 items-center justify-center bg-red-500"
          style={{ opacity: deleteOpacity }}
          onClick={handleDelete}
        >
          <Trash2 className="h-6 w-6 text-white" />
        </motion.button>
      )}

      {/* Swipeable card */}
      <motion.button
        onClick={handleClick}
        className="relative z-10 w-full rounded-2xl bg-card/60 p-4 text-left backdrop-blur-sm border border-border/30 transition-colors hover:bg-card/80"
        style={{ x }}
        animate={controls}
        drag={onRecordingDelete ? "x" : false}
        dragConstraints={{ left: -DELETE_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        whileTap={onRecordingDelete ? undefined : { scale: 0.99 }}
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
    </div>
  )
}

export default RecordingCard

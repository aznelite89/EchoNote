"use client"

import { motion, useMotionValue, PanInfo, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import type { Recording } from "@/types/recording"
import RecordingCard from "./recording-card"

interface BottomSheetProps {
  recordings: Recording[]
  onRecordingClick: (recording: Recording) => void
  onRecordingDelete?: (id: string) => void | Promise<void>
}

const BottomSheet = ({
  recordings,
  onRecordingClick,
  onRecordingDelete,
}: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const y = useMotionValue(0)

  const minHeight = 140
  const maxHeight =
    typeof window !== "undefined" ? window.innerHeight * 0.7 : 500

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.velocity.y < -500 || info.offset.y < -100) {
      setIsExpanded(true)
    } else if (info.velocity.y > 500 || info.offset.y > 100) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    y.set(0)
  }, [isExpanded, y])

  return (
    <>
      {/* Backdrop — tap to collapse */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Sheet */}
      <motion.div
        className="fixed left-0 right-0 z-40 rounded-t-3xl bg-card/90 backdrop-blur-xl border-t border-muted-foreground/30"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 4rem)",
          y,
        }}
        initial={{ height: minHeight }}
        animate={{ height: isExpanded ? maxHeight : minHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {/* Handle + Header — tap to toggle */}
        <div
          className="cursor-pointer"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            <div>
              <h2 className="text-foreground font-extrabold text-lg tracking-tight">
                Recent Notes
              </h2>
              <p className="text-xs font-semibold text-muted-foreground">
                {recordings.length} recordings
              </p>
            </div>
            <div className="flex -space-x-2">
              {recordings.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-lg border-2 border-card bg-gradient-to-br from-primary/20 to-accent/20"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <motion.div
            className="overflow-y-auto px-4 pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ maxHeight: maxHeight - 100 }}
          >
            <div className="flex flex-col gap-3">
              {recordings.map((recording) => (
                <RecordingCard
                  key={recording.id}
                  recording={recording}
                  onClick={() => onRecordingClick(recording)}
                  onRecordingDelete={onRecordingDelete}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default BottomSheet

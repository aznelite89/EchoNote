"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Filter,
  MessageSquare,
  Phone,
  Search,
  Users,
  Video,
} from "lucide-react"
import type { Recording } from "@/types/recording"
import RecordingCard from "./recording-card"

interface HistoryScreenProps {
  recordings: Recording[]
  onRecordingClick: (recording: Recording) => void
  onRecordingDelete?: (id: string) => void | Promise<void>
}

type FilterType = "all" | "meeting" | "call" | "interview" | "chat"

const filters: { id: FilterType; label: string; icon?: any }[] = [
  { id: "all", label: "All" },
  { id: "meeting", label: "Meetings", icon: Video },
  { id: "call", label: "Calls", icon: Phone },
  { id: "interview", label: "Interviews", icon: Users },
  { id: "chat", label: "Chats", icon: MessageSquare }
]

const HistoryScreen = ({
  recordings,
  onRecordingClick,
  onRecordingDelete,
}: HistoryScreenProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRecordings = recordings.filter((recording) => {
    const matchesFilter =
      activeFilter === "all" || recording.type === activeFilter
    const matchesSearch =
      searchQuery === "" ||
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Group recordings by date
  const groupedRecordings = filteredRecordings.reduce(
    (groups, recording) => {
      const date = recording.timestamp.includes("Today")
        ? "Today"
        : recording.timestamp.includes("Yesterday")
          ? "Yesterday"
          : "Earlier"
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(recording)
      return groups
    },
    {} as Record<string, Recording[]>
  )

  return (
    <motion.div
      className="min-h-screen bg-background pb-32"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header */}
      <div className="px-5 py-6">
        <motion.h1
          className="text-4xl font-black text-foreground tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          History
        </motion.h1>
        <motion.p
          className="mt-1 font-semibold text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {recordings.length} total recordings
        </motion.p>
      </div>

      {/* Search */}
      <motion.div
        className="px-5 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl bg-secondary/50 border border-border/30 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mb-6 overflow-x-auto px-5 scrollbar-hide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground border border-border/30"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {filter.icon && <filter.icon className="h-4 w-4" />}
                {filter.label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Recordings List */}
      <div className="px-5">
        {Object.entries(groupedRecordings).map(
          ([date, dateRecordings], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + groupIndex * 0.05 }}
              className="mb-6"
            >
              <h3 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
                {date}
              </h3>
              <div className="flex flex-col gap-3">
                {dateRecordings.map((recording, i) => (
                  <motion.div
                    key={recording.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + groupIndex * 0.05 + i * 0.03 }}
                  >
                    <RecordingCard
                      recording={recording}
                      onClick={() => onRecordingClick(recording)}
                      onRecordingDelete={onRecordingDelete}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        )}

        {filteredRecordings.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="rounded-full bg-secondary/50 p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No recordings found</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default HistoryScreen

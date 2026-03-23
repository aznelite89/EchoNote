"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, CheckCircle2, Clock, Loader2, Mic, RefreshCw, Zap } from "lucide-react"
import { format, parseISO } from "date-fns"
import { apiGetInsights, type Insights } from "@/lib/recording-api"

const formatChange = (value: number) => {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${Math.round(value)}%`
}

const InsightsScreen = () => {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetInsights()
      setInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  if (loading) {
    return (
      <motion.div
        className="min-h-screen bg-background flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    )
  }

  if (error || !insights) {
    return (
      <motion.div
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <p className="text-muted-foreground text-center">{error ?? "No data available"}</p>
        <button
          onClick={fetchInsights}
          className="flex items-center gap-2 text-primary text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </motion.div>
    )
  }

  const stats = [
    {
      icon: Mic,
      label: "Total Recordings",
      value: insights.totalRecordings.toString(),
      change: formatChange(insights.recordingsChange),
      positive: insights.recordingsChange >= 0,
    },
    {
      icon: Clock,
      label: "Total Duration",
      value: insights.durationFormatted,
      change: formatChange(insights.durationChange),
      positive: insights.durationChange >= 0,
    },
    {
      icon: Zap,
      label: "Action Items",
      value: insights.totalActionItems.toString(),
      change: formatChange(insights.actionItemChange),
      positive: insights.actionItemChange >= 0,
    },
    {
      icon: Calendar,
      label: "This Week",
      value: insights.thisWeekCount.toString(),
      change: formatChange(insights.thisWeekChange),
      positive: insights.thisWeekChange >= 0,
    },
  ]

  const maxActivityCount = Math.max(...insights.weeklyActivity.map((d) => d.count), 1)

  const completionRate =
    insights.totalActionItems > 0
      ? Math.round((insights.completedActions / insights.totalActionItems) * 100)
      : 0

  return (
    <motion.div
      className="min-h-screen bg-background"
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
          Insights
        </motion.h1>
        <motion.p
          className="mt-1 font-semibold text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          Your conversation analytics
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="px-5 mb-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl bg-card/60 border border-border/30 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    stat.positive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black text-foreground">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-muted-foreground mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        className="px-5 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
          Weekly Activity
        </h2>
        <div className="rounded-2xl bg-card/60 border border-border/30 p-5">
          <div className="flex items-end justify-between gap-2 h-32">
            {insights.weeklyActivity.map((day, i) => {
              const heightPct = (day.count / maxActivityCount) * 100
              const dayLabel = format(parseISO(day.date), "EEE")
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    className="w-full rounded-lg bg-gradient-to-t from-primary/60 to-primary min-h-[4px]"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPct, 3)}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-foreground/70">
                      {day.count}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {dayLabel}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="px-5">
        <h2 className="mb-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
          Summary
        </h2>
        <div className="flex flex-col gap-3">
          {/* Action Item Completion */}
          <motion.div
            className="rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30 p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-foreground">
                  Action Items
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                  {insights.completedActions} of {insights.totalActionItems} completed ({completionRate}%)
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Avg Confidence */}
          <motion.div
            className="rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30 p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2 shrink-0">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">
                  Avg Confidence
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                  {Math.round(insights.avgConfidence * 100)}% transcription accuracy
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recordings by Type */}
          {Object.keys(insights.recordingsByType).length > 0 && (
            <motion.div
              className="rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30 p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2 shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-foreground">
                    By Type
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(insights.recordingsByType).map(([type, count]) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground"
                      >
                        <span className="capitalize">{type}</span>
                        <span className="text-foreground">{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default InsightsScreen

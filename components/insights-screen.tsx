"use client"

import { motion } from "framer-motion"
import { BarChart3, Calendar, Clock, Mic, TrendingUp, Zap } from "lucide-react"

interface InsightsScreenProps {
  totalRecordings: number
  totalDuration: string
}

const InsightsScreen = ({
  totalRecordings,
  totalDuration
}: InsightsScreenProps) => {
  const stats = [
    {
      icon: Mic,
      label: "Total Recordings",
      value: totalRecordings.toString(),
      change: "+12%",
      positive: true
    },
    {
      icon: Clock,
      label: "Total Duration",
      value: totalDuration,
      change: "+8%",
      positive: true
    },
    {
      icon: Zap,
      label: "Action Items",
      value: "47",
      change: "+23%",
      positive: true
    },
    {
      icon: Calendar,
      label: "This Week",
      value: "12",
      change: "-5%",
      positive: false
    }
  ]

  const insights = [
    {
      title: "Most Active Day",
      description: "Tuesday with an average of 4 recordings",
      icon: TrendingUp
    },
    {
      title: "Common Topics",
      description: "Product roadmap, Sprint planning, Design reviews",
      icon: BarChart3
    },
    {
      title: "Team Engagement",
      description: "85% of action items completed on time",
      icon: Zap
    }
  ]

  return (
    <div
      className="min-h-screen bg-background"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
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

      {/* Weekly Chart Placeholder */}
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
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const heights = [60, 100, 80, 45, 90, 30, 20]
              return (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    className="w-full rounded-lg bg-gradient-to-t from-primary/60 to-primary"
                    initial={{ height: 0 }}
                    animate={{ height: `${heights[i]}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <div className="px-5">
        <h2 className="mb-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
          AI Insights
        </h2>
        <div className="flex flex-col gap-3">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              className="rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30 p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2 shrink-0">
                  <insight.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground">
                    {insight.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InsightsScreen

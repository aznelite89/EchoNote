"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Share2, Download, Edit3, Check, Circle, Quote, Sparkles } from "lucide-react"
import type { Recording, ActionItem } from "@/types/recording"
import { useState } from "react"

interface SummaryScreenProps {
  recording: Recording
  onBack: () => void
}

export function SummaryScreen({ recording, onBack }: SummaryScreenProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>(
    recording.actionItems || []
  )

  const toggleActionItem = (id: string) => {
    setActionItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-4 pt-12">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back</span>
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button
              className="rounded-full bg-secondary/50 p-2"
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="h-5 w-5 text-muted-foreground" />
            </motion.button>
            <motion.button
              className="rounded-full bg-secondary/50 p-2"
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </motion.button>
            <motion.button
              className="rounded-full bg-secondary/50 p-2"
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 pb-24">
        {/* Title & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">AI Summary</span>
            </div>
            {recording.confidence && (
              <span className="text-xs text-muted-foreground">
                {Math.round(recording.confidence * 100)}% confidence
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">{recording.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{recording.duration}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>{recording.timestamp}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span className="capitalize">{recording.type}</span>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
            Summary
          </h2>
          <p className="text-foreground leading-relaxed font-medium">{recording.summary}</p>
        </motion.div>

        {/* Key Points */}
        {recording.keyPoints && recording.keyPoints.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
              Key Points
            </h2>
            <div className="rounded-2xl bg-card/60 border border-border/30 p-4">
              <ul className="space-y-3">
                {recording.keyPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-foreground font-medium">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
              Action Items
            </h2>
            <div className="rounded-2xl bg-card/60 border border-border/30 p-4">
              <ul className="space-y-3">
                {actionItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <button
                      onClick={() => toggleActionItem(item.id)}
                      className="flex w-full items-start gap-3 text-left"
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.completed ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <span
                        className={`font-semibold transition-all ${
                          item.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Highlights */}
        {recording.highlights && recording.highlights.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
              Highlights
            </h2>
            <div className="space-y-3">
              {recording.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/30 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 shrink-0 text-primary" />
                    <p className="text-foreground italic">{'"'}{highlight}{'"'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

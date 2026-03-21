"use client"

import { motion } from "framer-motion"
import { Home, Clock, Lightbulb, User } from "lucide-react"

type Tab = "home" | "history" | "insights" | "profile"

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs = [
  { id: "home" as Tab, icon: Home, label: "Home" },
  { id: "history" as Tab, icon: Clock, label: "History" },
  { id: "insights" as Tab, icon: Lightbulb, label: "Insights" },
  { id: "profile" as Tab, icon: User, label: "Profile" },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/80 backdrop-blur-xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto flex max-w-md items-center justify-around px-6 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`h-6 w-6 transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-extrabold transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

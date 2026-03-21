"use client"

import { motion } from "framer-motion"
import {
  Settings,
  Bell,
  Cloud,
  Lock,
  HelpCircle,
  ChevronRight,
  Moon,
  Globe,
  Smartphone,
} from "lucide-react"

export function ProfileScreen() {
  const menuItems = [
    { icon: Bell, label: "Notifications", badge: "3" },
    { icon: Cloud, label: "Cloud Sync", status: "Connected" },
    { icon: Lock, label: "Privacy & Security" },
    { icon: Moon, label: "Appearance", status: "Dark" },
    { icon: Globe, label: "Language", status: "English" },
    { icon: Smartphone, label: "Connected Devices", badge: "2" },
    { icon: HelpCircle, label: "Help & Support" },
  ]

  return (
    <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}>
      {/* Header */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-4xl font-black text-foreground tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Profile
          </motion.h1>
          <motion.button
            className="rounded-full bg-secondary/50 p-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div
        className="mx-5 mb-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/30 p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl font-black text-foreground">JD</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-foreground">John Doe</h2>
            <p className="text-sm font-medium text-muted-foreground">john@example.com</p>
          </div>
          <motion.button
            className="rounded-xl bg-primary/20 px-4 py-2 text-sm font-medium text-primary"
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
        </div>

        {/* Plan Badge */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-extrabold text-foreground">Pro</p>
            </div>
            <motion.button
              className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background"
              whileTap={{ scale: 0.95 }}
            >
              Upgrade
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        className="mx-5 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
          Usage This Month
        </h3>
        <div className="rounded-2xl bg-card/60 border border-border/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-muted-foreground">Recording Time</span>
            <span className="text-sm font-extrabold text-foreground">12h 30m / 20h</span>
          </div>
          <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: "62.5%" }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="px-5">
        <h3 className="mb-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
          Settings
        </h3>
        <div className="rounded-2xl bg-card/60 border border-border/30 overflow-hidden">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              className="flex w-full items-center gap-3 px-4 py-3.5 border-b border-border/20 last:border-b-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="rounded-lg bg-secondary/50 p-2">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-extrabold text-foreground">
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                  {item.badge}
                </span>
              )}
              {item.status && (
                <span className="text-sm text-muted-foreground">{item.status}</span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Version */}
      <motion.p
        className="mt-8 text-center text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Convo AI v1.0.0
      </motion.p>
    </div>
  )
}

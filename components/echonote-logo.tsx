"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MOTION_SSR_SAFE } from "@/lib/motion-policy"

interface EchoNoteLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  animated?: boolean
}

const sizeConfig = {
  sm: { icon: 32, text: "text-lg", gap: "gap-2" },
  md: { icon: 40, text: "text-xl", gap: "gap-2.5" },
  lg: { icon: 56, text: "text-2xl", gap: "gap-3" },
  xl: { icon: 72, text: "text-3xl", gap: "gap-4" }
}

export function EchoNoteLogo({
  size = "md",
  showText = true,
  className,
  animated = true
}: EchoNoteLogoProps) {
  const config = sizeConfig[size]
  /** Production: full ring/line intro (classic `animated`). Dev: no hidden SSR `initial` so local prerender stays readable. */
  const runIntro = animated && MOTION_SSR_SAFE

  return (
    <div className={cn("flex items-center", config.gap, className)}>
      {/* Logo Mark */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: config.icon, height: config.icon }}
      >
        {/* Outer echo ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          initial={runIntro ? { scale: 0.8, opacity: 0 } : false}
          animate={runIntro ? { scale: 1, opacity: 1 } : false}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Middle echo ring */}
        <motion.div
          className="absolute rounded-full border-2 border-primary/50"
          style={{
            width: config.icon * 0.75,
            height: config.icon * 0.75
          }}
          initial={runIntro ? { scale: 0.8, opacity: 0 } : false}
          animate={runIntro ? { scale: 1, opacity: 1 } : false}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Inner circle with gradient */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-primary to-primary/80"
          style={{
            width: config.icon * 0.5,
            height: config.icon * 0.5
          }}
          initial={runIntro ? { scale: 0, opacity: 0 } : false}
          animate={runIntro ? { scale: 1, opacity: 1 } : false}
          transition={{ duration: 0.4 }}
        />

        {/* Waveform lines */}
        <svg
          viewBox="0 0 24 24"
          className="absolute z-10"
          style={{
            width: config.icon * 0.35,
            height: config.icon * 0.35
          }}
        >
          <motion.g
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="text-primary-foreground"
          >
            {/* Center line */}
            <motion.line
              x1="12"
              y1="8"
              x2="12"
              y2="16"
              initial={runIntro ? { pathLength: 0 } : false}
              animate={runIntro ? { pathLength: 1 } : false}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
            {/* Left line */}
            <motion.line
              x1="8"
              y1="10"
              x2="8"
              y2="14"
              initial={runIntro ? { pathLength: 0 } : false}
              animate={runIntro ? { pathLength: 1 } : false}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
            {/* Right line */}
            <motion.line
              x1="16"
              y1="10"
              x2="16"
              y2="14"
              initial={runIntro ? { pathLength: 0 } : false}
              animate={runIntro ? { pathLength: 1 } : false}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={runIntro ? { opacity: 0, x: -10 } : false}
          animate={runIntro ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span
            className={cn(
              "font-black tracking-tight text-foreground",
              config.text
            )}
          >
            Echo<span className="text-primary">Note</span>
          </span>
        </motion.div>
      )}
    </div>
  )
}

// App Icon variant - for app stores and favicons
export function EchoNoteAppIcon({
  size = 64,
  className
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-background via-card to-background",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl border border-primary/20" />

      {/* Outer echo ring */}
      <div
        className="absolute rounded-full border-2 border-primary/30"
        style={{ width: size * 0.75, height: size * 0.75 }}
      />

      {/* Middle echo ring */}
      <div
        className="absolute rounded-full border-2 border-primary/50"
        style={{ width: size * 0.55, height: size * 0.55 }}
      />

      {/* Inner circle with gradient */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-primary to-primary/80"
        style={{ width: size * 0.35, height: size * 0.35 }}
      />

      {/* Waveform lines */}
      <svg
        viewBox="0 0 24 24"
        className="absolute z-10"
        style={{ width: size * 0.25, height: size * 0.25 }}
      >
        <g
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="text-primary-foreground"
        >
          <line x1="12" y1="7" x2="12" y2="17" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="16" y1="10" x2="16" y2="14" />
        </g>
      </svg>
    </div>
  )
}

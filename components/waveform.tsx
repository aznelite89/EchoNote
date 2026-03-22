"use client"

import { motion } from "framer-motion"

interface WaveformProps {
  isActive: boolean
}

const Waveform = ({ isActive }: WaveformProps) => {
  const bars = 20

  return (
    <div className="flex h-16 items-end justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.04
        const baseHeight = Math.sin((i / bars) * Math.PI) * 0.7 + 0.3

        return (
          <motion.div
            key={i}
            className="w-[4px] rounded-full bg-gradient-to-t from-primary/60 to-primary will-change-transform"
            style={{ height: 48, transformOrigin: "bottom" }}
            initial={{ scaleY: 4 / 48, opacity: 0.3 }}
            animate={
              isActive
                ? {
                    scaleY: [4 / 48, baseHeight, 8 / 48, baseHeight * 0.67, 4 / 48],
                    opacity: [0.3, 1, 0.6, 0.9, 0.3],
                  }
                : { scaleY: 4 / 48, opacity: 0.3 }
            }
            transition={
              isActive
                ? {
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }
                : { duration: 0.3 }
            }
          />
        )
      })}
    </div>
  )
}

export default Waveform

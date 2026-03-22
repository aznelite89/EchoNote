"use client"

import { motion } from "framer-motion"

interface WaveformProps {
  isActive: boolean
}

const Waveform = ({ isActive }: WaveformProps) => {
  const bars = 40

  return (
    <div className="flex h-16 items-center justify-center gap-[2px]">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.02
        const baseHeight = Math.sin((i / bars) * Math.PI) * 0.7 + 0.3

        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-primary/60 to-primary"
            initial={{ height: 4, opacity: 0.3 }}
            animate={
              isActive
                ? {
                    height: [4, baseHeight * 48, 8, baseHeight * 32, 4],
                    opacity: [0.3, 1, 0.6, 0.9, 0.3],
                  }
                : { height: 4, opacity: 0.3 }
            }
            transition={
              isActive
                ? {
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
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

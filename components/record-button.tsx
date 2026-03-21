"use client"

import { motion } from "framer-motion"
import { Mic } from "lucide-react"

interface RecordButtonProps {
  isRecording: boolean
  isProcessing: boolean
  onClick: () => void
}

export function RecordButton({ isRecording, isProcessing, onClick }: RecordButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      {isRecording && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ width: 180, height: 180, left: -15, top: -15 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
            style={{ width: 180, height: 180, left: -15, top: -15 }}
          />
        </>
      )}

      {/* Button shadow/glow */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          boxShadow: isRecording
            ? [
                "0 0 30px 10px rgba(96, 165, 250, 0.3)",
                "0 0 50px 20px rgba(96, 165, 250, 0.4)",
                "0 0 30px 10px rgba(96, 165, 250, 0.3)",
              ]
            : "0 0 20px 5px rgba(96, 165, 250, 0.15)",
        }}
        transition={{
          duration: 1.5,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{ width: 150, height: 150 }}
      />

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={isProcessing}
        className="relative z-10 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={
          isRecording
            ? {
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Inner gradient overlay */}
        <div
          className={`absolute inset-2 rounded-full transition-all duration-500 ${
            isRecording
              ? "bg-gradient-to-br from-primary/40 to-accent/40"
              : "bg-gradient-to-br from-muted/50 to-secondary"
          }`}
        />

        {/* Icon container */}
        <motion.div
          className="relative z-10"
          animate={
            isRecording
              ? {
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 1,
            repeat: isRecording ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {isProcessing ? (
            <motion.div
              className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Mic
              className={`h-10 w-10 transition-colors duration-300 ${
                isRecording ? "text-primary" : "text-foreground"
              }`}
            />
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}

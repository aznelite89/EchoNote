"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MOTION_SSR_SAFE } from "@/lib/motion-policy"
import { RecordButton } from "./record-button"
import { Waveform } from "./waveform"
import { BottomSheet } from "./bottom-sheet"
import type { Recording } from "@/types/recording"

interface HomeScreenProps {
  isRecording: boolean
  isProcessing: boolean
  recordingTime: string
  onRecordToggle: () => void
  recordings: Recording[]
  onRecordingClick: (recording: Recording) => void
}

/** Production: classic Framer entrance. Dev: no entrance (`initial={false}`) so layout is visible immediately. */
function HomeStatusShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="mb-8 text-center"
      initial={MOTION_SSR_SAFE ? { opacity: 0, y: -20 } : false}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}

function HomeRecordShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={MOTION_SSR_SAFE ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

function HomeWaveShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="mt-10 w-full max-w-sm"
      initial={MOTION_SSR_SAFE ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function HomeScreen({
  isRecording,
  isProcessing,
  recordingTime,
  onRecordToggle,
  recordings,
  onRecordingClick
}: HomeScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ambient gradient orbs */}
        <motion.div
          className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {isRecording && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 pb-48">
        {/* Status Text */}
        <HomeStatusShell>
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-2xl font-extrabold text-foreground tracking-tight">
                  Processing
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  AI is analyzing your conversation...
                </p>
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <motion.div
                    className="h-3 w-3 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">
                    Recording
                  </p>
                </div>
                <p className="text-3xl font-black font-mono text-primary tracking-tight">
                  {recordingTime}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-3xl font-black text-foreground tracking-tight">
                  Tap to Record
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  Capture meetings, calls & conversations
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </HomeStatusShell>

        {/* Record Button */}
        <HomeRecordShell>
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onClick={onRecordToggle}
          />
        </HomeRecordShell>

        {/* Waveform */}
        <HomeWaveShell>
          <Waveform isActive={isRecording} />
        </HomeWaveShell>

        {/* Live Transcription Preview */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              className="mt-6 max-w-sm text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p className="text-sm text-muted-foreground italic">
                {'"'}...so we need to finalize the design by Friday and share it
                with the team...{'"'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        recordings={recordings}
        onRecordingClick={onRecordingClick}
      />
    </div>
  )
}

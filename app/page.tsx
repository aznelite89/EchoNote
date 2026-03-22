"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { HomeScreen } from "@/components/home-screen"
import { HistoryScreen } from "@/components/history-screen"
import { InsightsScreen } from "@/components/insights-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { SummaryScreen } from "@/components/summary-screen"
import { BottomNav } from "@/components/bottom-nav"
import { AuthScreens } from "@/components/auth-screens"
import { useRecorder } from "@/hooks/use-recorder"
import { apiListRecordings } from "@/lib/recording-api"
import type { Recording } from "@/types/recording"

type Tab = "home" | "history" | "insights" | "profile"

export default function ConvoAI() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Restore auth state from localStorage after hydration
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setIsAuthenticated(true)
    }
  }, [])
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [recordings, setRecordings] = useState<Recording[]>([])

  const { isRecording, isProcessing, recordingTime, liveTranscript, latestRecording, toggleRecording } = useRecorder()

  // Fetch recordings from backend on auth
  useEffect(() => {
    if (isAuthenticated) {
      apiListRecordings().then(setRecordings)
    }
  }, [isAuthenticated])

  // Prepend new recording when it arrives from the hook
  useEffect(() => {
    if (latestRecording) {
      setRecordings((prev) => [latestRecording, ...prev])
    }
  }, [latestRecording])

  const handleRecordingClick = useCallback((recording: Recording) => {
    setSelectedRecording(recording)
  }, [])

  const handleBackFromSummary = useCallback(() => {
    setSelectedRecording(null)
  }, [])

  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setIsAuthenticated(false)
    setActiveTab("home")
  }, [])

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return <AuthScreens onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground" style={{ paddingTop: 'env(safe-area-inset-top)' }}>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <HomeScreen
            key="home"
            isRecording={isRecording}
            isProcessing={isProcessing}
            recordingTime={recordingTime}
            liveTranscript={liveTranscript}
            onRecordToggle={toggleRecording}
            recordings={recordings}
            onRecordingClick={handleRecordingClick}
          />
        )}
        {activeTab === "history" && (
          <HistoryScreen
            key="history"
            recordings={recordings}
            onRecordingClick={handleRecordingClick}
          />
        )}
        {activeTab === "insights" && (
          <InsightsScreen
            key="insights"
            totalRecordings={recordings.length}
            totalDuration="3h 24m"
          />
        )}
        {activeTab === "profile" && <ProfileScreen key="profile" onLogout={handleLogout} />}
      </AnimatePresence>

      {/* Summary Screen Overlay */}
      <AnimatePresence>
        {selectedRecording && (
          <SummaryScreen
            recording={selectedRecording}
            onBack={handleBackFromSummary}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {!selectedRecording && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </main>
  )
}

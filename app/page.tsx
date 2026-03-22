"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import AuthScreens from "@/components/auth-screens"
import BottomNav from "@/components/bottom-nav"
import HistoryScreen from "@/components/history-screen"
import HomeScreen from "@/components/home-screen"
import InsightsScreen from "@/components/insights-screen"
import ProfileScreen from "@/components/profile-screen"
import SummaryScreen from "@/components/summary-screen"
import { useRecorder } from "@/hooks/use-recorder"
import { apiListRecordings, apiDeleteRecording, apiUpdateRecordingTitle } from "@/lib/recording-api"
import { toast } from "sonner"
import type { Recording } from "@/types/recording"

type Tab = "home" | "history" | "insights" | "profile"

const ConvoAI = () => {
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

  const handleRecordingTitleChange = useCallback(async (id: string, newTitle: string) => {
    let previousTitle = ""

    setRecordings((prev) => {
      const cur = prev.find((r) => r.id === id)
      if (cur) previousTitle = cur.title
      return prev.map((r) => (r.id === id ? { ...r, title: newTitle } : r))
    })

    setSelectedRecording((sel) => {
      if (sel?.id === id) {
        if (previousTitle === "") previousTitle = sel.title
        return { ...sel, title: newTitle }
      }
      return sel
    })

    try {
      await apiUpdateRecordingTitle(id, newTitle)
    } catch {
      toast.error("Failed to update title")
      const revert = previousTitle
      setRecordings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: revert } : r))
      )
      setSelectedRecording((sel) =>
        sel?.id === id ? { ...sel, title: revert } : sel
      )
    }
  }, [])

  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const handleDeleteRecording = useCallback(async (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id))
    try {
      await apiDeleteRecording(id)
    } catch {
      toast.error("Failed to delete recording")
      apiListRecordings().then(setRecordings)
    }
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
            onRecordingDelete={handleDeleteRecording}
          />
        )}
        {activeTab === "history" && (
          <HistoryScreen
            key="history"
            recordings={recordings}
            onRecordingClick={handleRecordingClick}
            onRecordingDelete={handleDeleteRecording}
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
            onTitleChange={handleRecordingTitleChange}
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

export default ConvoAI

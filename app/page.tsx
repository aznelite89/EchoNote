"use client"

import { useCallback, useEffect, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import AuthScreens from "@/components/auth-screens"
import BottomNav from "@/components/bottom-nav"
import HistoryScreen from "@/components/history-screen"
import HomeScreen from "@/components/home-screen"
import InsightsScreen from "@/components/insights-screen"
import ProfileScreen from "@/components/profile-screen"
import SummaryScreen from "@/components/summary-screen"
import { useRecorder } from "@/hooks/use-recorder"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setIsAuthenticated } from "@/slices/sessionSlice"
import { setActiveTab, type Tab } from "@/slices/navigationSlice"
import {
  prependRecording,
  removeRecording,
  setSelectedRecording,
  updateRecordingTitleRequest,
} from "@/slices/recordingsSlice"
import type { Recording } from "@/types/recording"

const ConvoAI = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((s) =>
    Boolean(s.session.get("isAuthenticated"))
  )
  const activeTab = useAppSelector((s) => s.navigation.get("activeTab") as Tab)
  const recordingsList = useAppSelector((s) => s.recordings.get("recordings"))
  const selectedImmutable = useAppSelector((s) =>
    s.recordings.get("selectedRecording")
  )

  const recordings = useMemo(
    () => recordingsList.toJS() as Recording[],
    [recordingsList]
  )
  const selectedRecording = useMemo((): Recording | null => {
    if (selectedImmutable == null) return null
    return selectedImmutable.toJS() as Recording
  }, [selectedImmutable])

  const { isRecording, isProcessing, recordingTime, liveTranscript, latestRecording, toggleRecording } =
    useRecorder()

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      dispatch(setIsAuthenticated(true))
    }
  }, [dispatch])

  useEffect(() => {
    if (latestRecording) {
      dispatch(prependRecording(latestRecording))
    }
  }, [latestRecording, dispatch])

  const handleRecordingClick = useCallback(
    (recording: Recording) => {
      dispatch(setSelectedRecording(recording))
    },
    [dispatch]
  )

  const handleBackFromSummary = useCallback(() => {
    dispatch(setSelectedRecording(null))
  }, [dispatch])

  const handleRecordingTitleChange = useCallback(
    async (id: string, newTitle: string) => {
      dispatch(updateRecordingTitleRequest({ id, newTitle }))
    },
    [dispatch]
  )

  const handleAuthSuccess = useCallback(() => {
    dispatch(setIsAuthenticated(true))
  }, [dispatch])

  const handleDeleteRecording = useCallback(
    async (id: string) => {
      dispatch(removeRecording(id))
    },
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    dispatch(setIsAuthenticated(false))
    dispatch(setActiveTab("home"))
  }, [dispatch])

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
        <BottomNav activeTab={activeTab} onTabChange={(t) => dispatch(setActiveTab(t))} />
      )}
    </main>
  )
}

export default ConvoAI

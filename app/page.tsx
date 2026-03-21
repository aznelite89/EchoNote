"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { HomeScreen } from "@/components/home-screen"
import { HistoryScreen } from "@/components/history-screen"
import { InsightsScreen } from "@/components/insights-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { SummaryScreen } from "@/components/summary-screen"
import { BottomNav } from "@/components/bottom-nav"
import type { Recording } from "@/types/recording"

// Sample data
const sampleRecordings: Recording[] = [
  {
    id: "1",
    title: "Q1 Product Roadmap Review",
    summary: "Discussed upcoming features for Q1 including the new dashboard redesign and API improvements. Team aligned on priorities.",
    duration: "45:32",
    timestamp: "Today, 2:30 PM",
    type: "meeting",
    confidence: 0.94,
    keyPoints: [
      "Dashboard redesign scheduled for end of January",
      "API v2 development to start next week",
      "Mobile app improvements prioritized for Q2",
      "Budget approved for additional engineering resources",
    ],
    actionItems: [
      { id: "a1", text: "Send updated timeline to stakeholders", completed: false, assignee: "John" },
      { id: "a2", text: "Schedule design review meeting", completed: true, assignee: "Sarah" },
      { id: "a3", text: "Create API v2 technical spec", completed: false, assignee: "Mike" },
      { id: "a4", text: "Review mobile app analytics", completed: false, assignee: "Emma" },
    ],
    highlights: [
      "We're confident we can deliver the dashboard by end of January",
      "The API improvements will significantly reduce latency",
    ],
  },
  {
    id: "2",
    title: "Client Onboarding Call",
    summary: "Walked through the platform with new enterprise client. Covered key features, integrations, and support options.",
    duration: "32:15",
    timestamp: "Today, 11:00 AM",
    type: "call",
    confidence: 0.91,
    keyPoints: [
      "Client impressed with AI summarization feature",
      "Integration with Slack is a priority for them",
      "They need SSO setup before going live",
      "Training session scheduled for next week",
    ],
    actionItems: [
      { id: "b1", text: "Send SSO configuration guide", completed: false },
      { id: "b2", text: "Schedule training session", completed: false },
      { id: "b3", text: "Prepare Slack integration docs", completed: true },
    ],
    highlights: [
      "This is exactly what we've been looking for",
    ],
  },
  {
    id: "3",
    title: "Engineering Standup",
    summary: "Daily sync with engineering team. Reviewed sprint progress and blockers. Backend team needs frontend support.",
    duration: "15:45",
    timestamp: "Yesterday, 9:30 AM",
    type: "meeting",
    confidence: 0.88,
    keyPoints: [
      "Sprint velocity on track",
      "Backend API blocked on frontend integration",
      "Code review backlog needs attention",
      "Testing automation improvements deployed",
    ],
    actionItems: [
      { id: "c1", text: "Review pending PRs", completed: true },
      { id: "c2", text: "Pair programming session for API integration", completed: false },
    ],
    highlights: [],
  },
  {
    id: "4",
    title: "Interview - Senior Designer",
    summary: "Technical interview with candidate for senior designer role. Strong portfolio, good cultural fit. Recommended for next round.",
    duration: "52:10",
    timestamp: "Yesterday, 3:00 PM",
    type: "interview",
    confidence: 0.92,
    keyPoints: [
      "10 years of experience in product design",
      "Led design system at previous company",
      "Strong Figma and prototyping skills",
      "Good communication and presentation",
    ],
    actionItems: [
      { id: "d1", text: "Submit interview feedback", completed: false },
      { id: "d2", text: "Schedule design challenge", completed: false },
    ],
    highlights: [
      "Design systems are my passion - I love creating scalable solutions",
    ],
  },
  {
    id: "5",
    title: "Team Retrospective",
    summary: "Sprint retrospective covering wins, challenges, and areas for improvement. Action items assigned for process updates.",
    duration: "38:20",
    timestamp: "Earlier, Mar 15",
    type: "meeting",
    confidence: 0.89,
    keyPoints: [
      "Deployment process has improved significantly",
      "Need better async communication practices",
      "Documentation could be more comprehensive",
      "Team morale is high",
    ],
    actionItems: [
      { id: "e1", text: "Update deployment runbook", completed: true },
      { id: "e2", text: "Create Slack channel guidelines", completed: false },
    ],
    highlights: [],
  },
]

type Tab = "home" | "history" | "insights" | "profile"

export default function ConvoAI() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState("00:00")
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [recordings] = useState<Recording[]>(sampleRecordings)

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      let seconds = 0
      interval = setInterval(() => {
        seconds++
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        setRecordingTime(
          `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        )
      }, 1000)
    } else {
      setRecordingTime("00:00")
    }

    return () => clearInterval(interval)
  }, [isRecording])

  const handleRecordToggle = useCallback(() => {
    if (isRecording) {
      setIsRecording(false)
      setIsProcessing(true)
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false)
        // In a real app, this would add the new recording to the list
      }, 3000)
    } else {
      setIsRecording(true)
    }
  }, [isRecording])

  const handleRecordingClick = useCallback((recording: Recording) => {
    setSelectedRecording(recording)
  }, [])

  const handleBackFromSummary = useCallback(() => {
    setSelectedRecording(null)
  }, [])

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <HomeScreen
            key="home"
            isRecording={isRecording}
            isProcessing={isProcessing}
            recordingTime={recordingTime}
            onRecordToggle={handleRecordToggle}
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
        {activeTab === "profile" && <ProfileScreen key="profile" />}
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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EchoNote (branded as "Convo AI") is an AI-powered meeting notes and conversation summarization app. It's a mobile-first Next.js frontend prototype with sample data — no backend or real recording functionality yet.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Start production:** `pnpm start`
- **Add dependency:** `pnpm add <pkg>` (use `-D` for dev deps)

**Important:** Always use `pnpm`, never `npm` or `yarn`.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, RSC enabled)
- **Styling:** Tailwind CSS v4 with CSS variables for theming
- **UI Components:** shadcn/ui (new-york style) — components in `components/ui/`
- **Animations:** Framer Motion for page transitions (AnimatePresence)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Font:** Nunito (Google Fonts via `next/font`)

## Architecture

The app is a single-page client component (`app/page.tsx`) that manages all state and navigation:

- **Tab-based navigation** via `BottomNav` with four screens: Home, History, Insights, Profile
- **Screen components** (`components/home-screen.tsx`, `history-screen.tsx`, etc.) receive state as props from the root page
- **SummaryScreen** renders as a full-screen overlay when a recording is selected
- **Recording type** (`types/recording.ts`) is the core data model with fields for key points, action items, highlights, and confidence scores
- All data is currently hardcoded sample data in `app/page.tsx`

### shadcn/ui Configuration

- Config: `components.json` — aliases use `@/` path prefix
- Utility: `lib/utils.ts` exports `cn()` for class merging
- CSS variables defined in `app/globals.css`

### Dark-Mode Only

The app is hardcoded to dark mode (`<html className="dark">` in layout). The theme color is `#0a0f1a`.

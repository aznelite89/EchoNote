# EchoNote (Frontend)

AI-powered meeting notes and conversation summarization app. This repository contains the **frontend only**. The backend lives in a separate repository: [EchoNote-api](../EchoNote-api).

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with CSS variables
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) (new-york style)
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Package Manager:** pnpm
- **Deployment:** Vercel

## Architecture

```
EchoNote (Frontend - Vercel)          EchoNote-api (Backend - separate repo)
┌────────────────────────────┐        ┌─────────────────────────────┐
│  Next.js App Router        │  API   │  Go backend                 │
│  ├── app/         (routes) │ ◄────► │  ├── Auth (JWT/OAuth)       │
│  ├── components/  (screens)│        │  ├── Audio storage          │
│  ├── hooks/       (custom) │        │  ├── AI transcription       │
│  ├── lib/         (utils)  │        │  ├── Real-time (WebSocket)  │
│  ├── types/       (models) │        │  └── Notifications          │
│  └── styles/      (css)    │        └─────────────────────────────┘
└────────────────────────────┘
```

The frontend is a single-page client app with tab-based navigation (Home, History, Insights, Profile). Screen components receive state as props from the root page (`app/page.tsx`). Recording summaries render as full-screen overlays.

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io) installed (`npm install -g pnpm`)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Other Commands

```bash
# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

## Project Structure

```
app/
  layout.tsx        # Root layout (Nunito font, dark mode, Vercel Analytics)
  page.tsx          # Main page — manages all app state and navigation
  globals.css       # Tailwind + CSS variable theming

components/
  home-screen.tsx   # Home tab with recording controls
  history-screen.tsx
  insights-screen.tsx
  profile-screen.tsx
  summary-screen.tsx # Full-screen recording summary overlay
  bottom-nav.tsx    # Tab navigation bar
  record-button.tsx
  recording-card.tsx
  waveform.tsx
  ui/               # shadcn/ui components

hooks/              # Custom React hooks
lib/utils.ts        # cn() utility for Tailwind class merging
types/recording.ts  # Recording & ActionItem interfaces
```

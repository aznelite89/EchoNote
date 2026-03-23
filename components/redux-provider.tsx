"use client"

import { useRef, type ReactNode } from "react"
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { makeStore, type AppStore } from "@/store"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }
  if (!GOOGLE_CLIENT_ID) {
    return <Provider store={storeRef.current}>{children}</Provider>
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={storeRef.current}>{children}</Provider>
    </GoogleOAuthProvider>
  )
}

export default ReduxProvider

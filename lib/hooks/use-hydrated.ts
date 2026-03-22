"use client"

import { useEffect, useState } from "react"

/** True after the component mounts in the browser (always false on the server). */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

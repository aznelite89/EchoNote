declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string
          scope: string
          redirectURI: string
          usePopup: boolean
        }) => void
        signIn: () => Promise<{
          authorization: { id_token: string; code: string }
          user?: { name?: { firstName?: string; lastName?: string } }
        }>
      }
    }
  }
}

const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? ""
const APPLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? "http://localhost:3000"

let scriptLoaded = false

function loadAppleScript(): Promise<void> {
  if (scriptLoaded || typeof window === "undefined") return Promise.resolve()
  if (document.querySelector('script[src*="appleid.auth.js"]')) {
    scriptLoaded = true
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
    script.async = true
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error("Failed to load Apple Sign-In SDK"))
    document.head.appendChild(script)
  })
}

export interface AppleSignInResult {
  idToken: string
  name?: string
}

export async function signInWithApple(): Promise<AppleSignInResult> {
  if (!APPLE_CLIENT_ID) {
    throw new Error("Apple sign-in is unavailable. Set NEXT_PUBLIC_APPLE_CLIENT_ID.")
  }

  await loadAppleScript()

  if (!window.AppleID) {
    throw new Error("Apple Sign-In SDK failed to initialize")
  }

  window.AppleID.auth.init({
    clientId: APPLE_CLIENT_ID,
    scope: "name email",
    redirectURI: APPLE_REDIRECT_URI,
    usePopup: true,
  })

  const response = await window.AppleID.auth.signIn()

  const idToken = response.authorization.id_token

  // Apple only sends user info on the very first authorization
  let name: string | undefined
  if (response.user?.name) {
    const { firstName, lastName } = response.user.name
    name = [firstName, lastName].filter(Boolean).join(" ") || undefined
  }

  return { idToken, name }
}

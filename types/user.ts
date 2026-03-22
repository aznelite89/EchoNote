export interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro"
  avatarUrl: string | null
  createdAt: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

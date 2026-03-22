import type { User, TokenPair } from "@/types/user"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1"

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "An unexpected error occurred" }))
    throw new Error(body.error ?? "An unexpected error occurred")
  }

  return res.json() as Promise<T>
}

export async function apiGetMe(): Promise<User> {
  return apiFetch("/users/me")
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ user: User; tokens: TokenPair }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function apiRegister(
  email: string,
  name: string,
  password: string
): Promise<{ user: User; tokens: TokenPair }> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  })
}

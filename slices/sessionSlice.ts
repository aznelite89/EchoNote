import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"
import type { User, TokenPair } from "@/types/user"

const initialState = fromJS({
  isAuthenticated: false,
  user: null as User | null,
  accessToken: null as string | null,
  refreshToken: null as string | null,
})

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; tokens: TokenPair }>
    ) => {
      const { user, tokens } = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", tokens.accessToken)
        localStorage.setItem("refreshToken", tokens.refreshToken)
      }
      return state.merge(
        fromJS({
          isAuthenticated: true,
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      )
    },

    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
      return state.merge(
        fromJS({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      )
    },

    setTokens: (state, action: PayloadAction<TokenPair>) => {
      const { accessToken, refreshToken } = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
      }
      return state.merge(fromJS({ accessToken, refreshToken }))
    },

    restoreSession: (state) => state, // no-op reducer — triggers saga
  },
})

export const { loginSuccess, logout, setTokens, restoreSession } =
  sessionSlice.actions

export default sessionSlice.reducer

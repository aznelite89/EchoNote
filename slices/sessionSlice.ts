import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"

const initialState = fromJS({
  isAuthenticated: false,
})

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      return state.merge(
        fromJS({
          isAuthenticated: action.payload,
        })
      )
    },
  },
})

export const { setIsAuthenticated } = sessionSlice.actions

export default sessionSlice.reducer

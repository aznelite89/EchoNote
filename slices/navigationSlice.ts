import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"

export type Tab = "home" | "history" | "insights" | "profile"

const initialState = fromJS({
  activeTab: "home" as Tab,
})

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<Tab>) => {
      return state.merge(
        fromJS({
          activeTab: action.payload,
        })
      )
    },
  },
})

export const { setActiveTab } = navigationSlice.actions

export default navigationSlice.reducer

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"

const initialState = fromJS({
  lastError: null as string | null,
})

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setLastError: (state, action: PayloadAction<string | null>) => {
      return state.merge(
        fromJS({
          lastError: action.payload,
        })
      )
    },
  },
})

export const { setLastError } = commonSlice.actions

export default commonSlice.reducer

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fromJS, type List, type Map as ImMap } from "immutable"
import type { Recording } from "@/types/recording"

const initialState: ImMap<string, unknown> = fromJS({
  recordings: [],
  selectedRecording: null,
})

const recordingsSlice = createSlice({
  name: "recordings",
  initialState,
  reducers: {
    setRecordings: (state, action: PayloadAction<Recording[]>) => {
      return state.merge(
        fromJS({
          recordings: action.payload,
        })
      )
    },
    prependRecording: (state, action: PayloadAction<Recording>) => {
      const rec = fromJS(action.payload)
      const list = state.get("recordings") as List<ImMap<string, unknown>>
      return state.set("recordings", list.unshift(rec))
    },
    removeRecording: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const list = state.get("recordings") as List<ImMap<string, unknown>>
      const filtered = list.filter((r) => r.get("id") !== id)
      let next = state.set("recordings", filtered)
      const sel = state.get("selectedRecording") as ImMap<string, unknown> | null
      if (sel && sel.get("id") === id) {
        next = next.set("selectedRecording", null)
      }
      return next
    },
    setSelectedRecording: (state, action: PayloadAction<Recording | null>) => {
      return state.merge(
        fromJS({
          selectedRecording: action.payload,
        })
      )
    },
    /** Dispatched to trigger saga; state unchanged. */
    updateRecordingTitleRequest: (
      state,
      _action: PayloadAction<{ id: string; newTitle: string }>
    ) => state,
    applyRecordingTitle: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const { id, title } = action.payload
      const list = state.get("recordings") as List<ImMap<string, unknown>>
      const newList = list.map((r) =>
        r.get("id") === id ? r.set("title", title) : r
      )
      let next = state.set("recordings", newList)
      const sel = state.get("selectedRecording") as ImMap<string, unknown> | null
      if (sel && sel.get("id") === id) {
        next = next.set("selectedRecording", sel.set("title", title))
      }
      return next
    },
    revertRecordingTitle: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const { id, title } = action.payload
      const list = state.get("recordings") as List<ImMap<string, unknown>>
      const newList = list.map((r) =>
        r.get("id") === id ? r.set("title", title) : r
      )
      let next = state.set("recordings", newList)
      const sel = state.get("selectedRecording") as ImMap<string, unknown> | null
      if (sel && sel.get("id") === id) {
        next = next.set("selectedRecording", sel.set("title", title))
      }
      return next
    },
  },
})

export const {
  setRecordings,
  prependRecording,
  removeRecording,
  setSelectedRecording,
  updateRecordingTitleRequest,
  applyRecordingTitle,
  revertRecordingTitle,
} = recordingsSlice.actions

export default recordingsSlice.reducer

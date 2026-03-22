import { createAction, type UnknownAction } from "@reduxjs/toolkit"
import { fromJS, type List, type Map as ImMap } from "immutable"
import type { Recording } from "@/types/recording"

export const setRecordings = createAction<Recording[]>("recordings/setRecordings")
export const prependRecording = createAction<Recording>("recordings/prependRecording")
export const removeRecording = createAction<string>("recordings/removeRecording")
export const setSelectedRecording = createAction<Recording | null>(
  "recordings/setSelectedRecording"
)
export const updateRecordingTitleRequest = createAction<{
  id: string
  newTitle: string
}>("recordings/updateRecordingTitleRequest")
export const applyRecordingTitle = createAction<{ id: string; title: string }>(
  "recordings/applyRecordingTitle"
)
export const revertRecordingTitle = createAction<{ id: string; title: string }>(
  "recordings/revertRecordingTitle"
)

const initialState: ImMap<string, unknown> = fromJS({
  recordings: [],
  selectedRecording: null,
})

export default function recordingsReducer(
  state: ImMap<string, unknown> = initialState,
  action: UnknownAction
): ImMap<string, unknown> {
  if (setRecordings.match(action)) {
    return state.merge(
      fromJS({
        recordings: action.payload,
      })
    )
  }

  if (prependRecording.match(action)) {
    const rec = fromJS(action.payload)
    const list = state.get("recordings") as List<ImMap<string, unknown>>
    return state.set("recordings", list.unshift(rec))
  }

  if (removeRecording.match(action)) {
    const id = action.payload
    const list = state.get("recordings") as List<ImMap<string, unknown>>
    const filtered = list.filter((r) => r.get("id") !== id)
    let next = state.set("recordings", filtered)
    const sel = state.get("selectedRecording") as ImMap<string, unknown> | null
    if (sel && sel.get("id") === id) {
      next = next.set("selectedRecording", null as unknown)
    }
    return next
  }

  if (setSelectedRecording.match(action)) {
    return state.merge(
      fromJS({
        selectedRecording: action.payload,
      })
    )
  }

  if (applyRecordingTitle.match(action)) {
    const { id, title } = action.payload
    const list = state.get("recordings") as List<ImMap<string, unknown>>
    const newList = list.map((r) =>
      r.get("id") === id ? r.set("title", title as unknown) : r
    )
    let next = state.set("recordings", newList as unknown)
    const sel = state.get("selectedRecording") as ImMap<string, unknown> | null
    if (sel && sel.get("id") === id) {
      next = next.set(
        "selectedRecording",
        sel.set("title", title as unknown) as unknown
      )
    }
    return next
  }

  if (revertRecordingTitle.match(action)) {
    const { id, title } = action.payload
    const list = state.get("recordings") as List<ImMap<string, unknown>>
    const newList = list.map((r) =>
      r.get("id") === id ? r.set("title", title as unknown) : r
    )
    let next = state.set("recordings", newList as unknown)
    const sel = state.get("selectedRecording") as ImMap<string, unknown> | null
    if (sel && sel.get("id") === id) {
      next = next.set(
        "selectedRecording",
        sel.set("title", title as unknown) as unknown
      )
    }
    return next
  }

  return state
}

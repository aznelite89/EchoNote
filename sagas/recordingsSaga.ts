import { takeEvery, call, put, select } from "redux-saga/effects"
import type { Map as ImMap } from "immutable"
import type { List } from "immutable"
import {
  removeRecording,
  setRecordings,
  updateRecordingTitleRequest,
  applyRecordingTitle,
  revertRecordingTitle,
} from "@/slices/recordingsSlice"
import {
  apiDeleteRecording,
  apiListRecordings,
  apiUpdateRecordingTitle,
} from "@/lib/recording-api"
import { toast } from "sonner"
import type { RootState } from "@/store/root-state"

function* deleteRecordingSaga(action: ReturnType<typeof removeRecording>) {
  try {
    yield call(apiDeleteRecording, action.payload)
  } catch {
    toast.error("Failed to delete recording")
    const list: Awaited<ReturnType<typeof apiListRecordings>> =
      yield call(apiListRecordings)
    yield put(setRecordings(list))
  }
}

function* updateTitleSaga(
  action: ReturnType<typeof updateRecordingTitleRequest>
) {
  const { id, newTitle } = action.payload
  const recState = (yield select(
    (s: RootState) => s.recordings
  )) as ImMap<string, unknown>
  const recordings = recState.get("recordings") as List<ImMap<string, unknown>>
  const item = recordings.find((r) => r.get("id") === id)
  const previousTitle = item ? String(item.get("title") ?? "") : ""

  yield put(applyRecordingTitle({ id, title: newTitle }))

  try {
    yield call(apiUpdateRecordingTitle, id, newTitle)
  } catch {
    toast.error("Failed to update title")
    yield put(revertRecordingTitle({ id, title: previousTitle }))
  }
}

export default function* recordingsSaga() {
  yield takeEvery(removeRecording.type, deleteRecordingSaga)
  yield takeEvery(updateRecordingTitleRequest.type, updateTitleSaga)
}

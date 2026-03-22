import { takeLatest, put, call } from "redux-saga/effects"
import { setIsAuthenticated } from "@/slices/sessionSlice"
import {
  setRecordings,
  setSelectedRecording,
} from "@/slices/recordingsSlice"
import { apiListRecordings } from "@/lib/recording-api"

export default function* sessionSaga() {
  yield takeLatest(
    setIsAuthenticated.type,
    function* (action: ReturnType<typeof setIsAuthenticated>) {
      try {
        if (action.payload === true) {
          const list: Awaited<ReturnType<typeof apiListRecordings>> =
            yield call(apiListRecordings)
          yield put(setRecordings(list))
        } else {
          yield put(setRecordings([]))
          yield put(setSelectedRecording(null))
        }
      } catch (error) {
        console.debug("Error", error)
      }
    }
  )
}

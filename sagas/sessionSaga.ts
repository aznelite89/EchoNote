import { takeLatest, put, call } from "redux-saga/effects"
import { loginSuccess, logout, restoreSession } from "@/slices/sessionSlice"
import {
  setRecordings,
  setSelectedRecording,
} from "@/slices/recordingsSlice"
import { apiListRecordings } from "@/lib/recording-api"
import { apiGetMe } from "@/lib/api"
import type { User } from "@/types/user"
import type { Recording } from "@/types/recording"

function* onLoginSuccess() {
  try {
    const list: Recording[] = yield call(apiListRecordings)
    yield put(setRecordings(list))
  } catch (error) {
    console.debug("Failed to fetch recordings after login", error)
  }
}

function* onLogout() {
  yield put(setRecordings([]))
  yield put(setSelectedRecording(null))
}

function* onRestoreSession() {
  try {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null

    if (!accessToken) return

    const user: User = yield call(apiGetMe)
    yield put(
      loginSuccess({
        user,
        tokens: {
          accessToken,
          refreshToken: refreshToken ?? "",
        },
      })
    )
  } catch {
    // Token invalid/expired — clear everything
    yield put(logout())
  }
}

export default function* sessionSaga() {
  yield takeLatest(loginSuccess.type, onLoginSuccess)
  yield takeLatest(logout.type, onLogout)
  yield takeLatest(restoreSession.type, onRestoreSession)
}

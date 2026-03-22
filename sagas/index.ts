import { all, fork } from "redux-saga/effects"
import sessionSaga from "@/sagas/sessionSaga"
import commonSaga from "@/sagas/commonSaga"
import recordingsSaga from "@/sagas/recordingsSaga"

export default function* rootSaga() {
  try {
    yield all([
      fork(sessionSaga),
      fork(commonSaga),
      fork(recordingsSaga),
    ])
  } catch (error) {
    console.debug("Error", error)
  }
}

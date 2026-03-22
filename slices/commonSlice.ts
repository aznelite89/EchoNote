import { createAction, type UnknownAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"

export const setLastError = createAction<string | null>("common/setLastError")

const initialState = fromJS({
  lastError: null as string | null,
})

export default function commonReducer(
  state = initialState,
  action: UnknownAction
) {
  if (setLastError.match(action)) {
    return state.merge(
      fromJS({
        lastError: action.payload,
      })
    )
  }
  return state
}

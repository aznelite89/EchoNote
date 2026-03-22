import { createAction, type UnknownAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"

export const setIsAuthenticated = createAction<boolean>("session/setIsAuthenticated")

const initialState = fromJS({
  isAuthenticated: false,
})

export default function sessionReducer(
  state = initialState,
  action: UnknownAction
) {
  if (setIsAuthenticated.match(action)) {
    return state.merge(
      fromJS({
        isAuthenticated: action.payload,
      })
    )
  }
  return state
}

import { createAction, type UnknownAction } from "@reduxjs/toolkit"
import { fromJS } from "immutable"

export type Tab = "home" | "history" | "insights" | "profile"

export const setActiveTab = createAction<Tab>("navigation/setActiveTab")

const initialState = fromJS({
  activeTab: "home" as Tab,
})

export default function navigationReducer(
  state = initialState,
  action: UnknownAction
) {
  if (setActiveTab.match(action)) {
    return state.merge(
      fromJS({
        activeTab: action.payload,
      })
    )
  }
  return state
}

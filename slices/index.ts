import sessionReducer from "@/slices/sessionSlice"
import commonReducer from "@/slices/commonSlice"
import navigationReducer from "@/slices/navigationSlice"
import recordingsReducer from "@/slices/recordingsSlice"

const rootReducer = {
  session: sessionReducer,
  common: commonReducer,
  navigation: navigationReducer,
  recordings: recordingsReducer,
}

export default rootReducer

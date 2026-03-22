import sessionReducer from "@/slices/sessionSlice"
import commonReducer from "@/slices/commonSlice"
import navigationReducer from "@/slices/navigationSlice"
import recordingsReducer from "@/slices/recordingsSlice"

export type RootState = {
  session: ReturnType<typeof sessionReducer>
  common: ReturnType<typeof commonReducer>
  navigation: ReturnType<typeof navigationReducer>
  recordings: ReturnType<typeof recordingsReducer>
}

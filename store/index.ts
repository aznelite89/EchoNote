import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import rootReducer from "@/slices/index"
import rootSaga from "@/sagas/index"

export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(sagaMiddleware),
  })
  sagaMiddleware.run(rootSaga)
  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type { RootState } from "@/store/root-state"
export type AppDispatch = AppStore["dispatch"]

import { configureStore } from "@reduxjs/toolkit";
import videoCallReducer from "../features/videoCall/videoCallSlice";

const store = configureStore({
  reducer: {
    videoCall: videoCallReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;

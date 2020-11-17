import { configureStore } from "@reduxjs/toolkit";
import videoCallReducer from "../features/videoCall/videoCallSlice";

export default configureStore({
  reducer: {
    videoCall: videoCallReducer,
  },
});

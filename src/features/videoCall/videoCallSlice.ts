import { createSlice } from "@reduxjs/toolkit";

type VideoCallState = {
  appId: string;
  channel: string;
  uid: string;
  token: string | null;
  cameraId: string;
  microphoneId: string;
  mode: "rtc" | "live";
  codec: "h264" | "vp8";
};

const initialState: VideoCallState = {
  appId: "4b32d52f09e64eeda2fb482514669448",
  channel: "test",
  uid: "",
  token:
    "0064b32d52f09e64eeda2fb482514669448IAABihvOrDiVQ8ECM254tABOu3TViDrNJPLeMOOOC6f/uwx+f9gAAAAAEABID2Uq06+1XwEAAQDTr7Vf",
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264",
};

export const counterSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {},
});

export default counterSlice.reducer;

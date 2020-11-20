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
    "0064b32d52f09e64eeda2fb482514669448IABW93hjt7JmyfC/XyPUPrKhDXedQyUNDGe3OrA6nhCh5wx+f9gAAAAAEABID2Uq8XW4XwEAAQDxdbhf",
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264",
};

export const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {},
});

export default videoCallSlice.reducer;

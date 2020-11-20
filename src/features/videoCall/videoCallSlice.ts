import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VideoCallState = {
  appId: string;
  channel: string;
  token: string;
  uid: string;
  cameraId?: string;
  microphoneId?: string;
  mode: "rtc" | "live";
  codec: "h264" | "vp8";
  isChannelConfigured: boolean;
};

const initialState: VideoCallState = {
  appId: localStorage.getItem("appId") || "",
  channel: localStorage.getItem("channel") || "",
  token: localStorage.getItem("token") || "",
  uid: "",
  cameraId: undefined,
  microphoneId: "",
  mode: "rtc",
  codec: "h264",
  isChannelConfigured: JSON.parse(
    localStorage.getItem("isChannelConfigured") || "false"
  ),
};

export const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    updateState: (
      state,
      action: PayloadAction<{
        name: string;
        value: string;
      }>
    ) => {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    },
    configureChannel: (
      state,
      action: PayloadAction<{
        appId: string;
        channel: string;
        token: string;
      }>
    ) => {
      const { appId, channel, token } = action.payload;
      return {
        ...state,
        appId,
        channel,
        token,
      };
    },
    setChannelConfigured: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isChannelConfigured: action.payload,
      };
    },
  },
});

const { actions, reducer } = videoCallSlice;

export const { updateState, configureChannel, setChannelConfigured } = actions;

export default reducer;

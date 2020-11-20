import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useCamera, useMediaStream, useMicrophone } from ".";
import { RootState } from "../app/store";
import AgoraRTC, { AgoraClientType } from "../utils/AgoraEnhancer";

const useAgora = () => {
  const [agoraClient, setClient] = useState<AgoraClientType | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setisJoined] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const state = useSelector((state: RootState) => state.videoCall);
  const { enqueueSnackbar } = useSnackbar();
  const {
    localStream,
    remoteStreamList,
    setLocalStream,
    setRemoteStreamList,
  } = useMediaStream(agoraClient);
  const cameraList = useCamera(agoraClient);
  const microphoneList = useMicrophone(agoraClient);

  useEffect(() => {
    if (!state.cameraId || !localStream) {
      return;
    }
    localStream.switchDevice("video", state.cameraId);
  }, [state.cameraId, localStream]);

  const join = async () => {
    // Creates a new agora client with given parameters.
    // mode can be 'rtc' for real time communications or 'live' for live broadcasting.
    const client = AgoraRTC.createClient({
      mode: state.mode,
      codec: state.codec,
    });
    // Loads client into the state
    setClient(client);
    setIsLoading(true);
    try {
      const uid = isNaN(Number(state.uid)) ? null : Number(state.uid);

      // initializes the client with appId
      await client.init(state.appId);

      // joins a channel with a token, channel, user id
      await client.join(state.token, state.channel, uid);

      // create a ne stream
      const stream = AgoraRTC.createStream({
        streamID: uid || 12345,
        video: true,
        audio: true,
        screen: false,
        cameraId: cameraList[0]?.deviceId,
        microphoneId: microphoneList[0]?.deviceId,
      });
      setLocalStream(stream);

      // stream.setVideoProfile('480p_4')

      // Initalize the stream
      await stream.init();

      stream.play("local_stream");

      // Publish the stream to the channel.
      await client.publish(stream);

      // Set the state appropriately
      setIsPublished(true);
      setisJoined(true);
      enqueueSnackbar(`Joined channel ${state.channel}`, { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Leaves the channel on invoking the function call.
  const leave = async () => {
    if (!agoraClient || !localStream) {
      return;
    }

    setIsLoading(true);
    try {
      await agoraClient.leave();

      if (localStream.isPlaying()) {
        localStream.stop();
      }
      localStream.close();

      setLocalStream(undefined);
      setRemoteStreamList([]);
      setClient(undefined);
      setIsPublished(false);
      setisJoined(false);
      enqueueSnackbar("Left channel", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to leave, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Publish function to publish the stream to Agora. No need to invoke this after join.
  // This is to be invoke only after an unpublish
  const publish = async () => {
    if (!agoraClient || !localStream) {
      return;
    }

    setIsLoading(true);
    try {
      // Publish the stream to the channel.
      await agoraClient.publish(localStream);
      setIsPublished(true);
      enqueueSnackbar("Stream published", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Used to unpublish the stream.
  const unpublish = async () => {
    if (!agoraClient || !localStream) {
      return;
    }

    // unpublish the stream from the client
    await agoraClient.unpublish(localStream);
    setIsPublished(false);
    enqueueSnackbar("Stream unpublished", { variant: "info" });
  };

  return {
    agoraClient,
    localStream,
    remoteStreamList,
    cameraList,
    microphoneList,
    isLoading,
    isPublished,
    isJoined,
    join,
    leave,
    publish,
    unpublish,
  };
};

export default useAgora;

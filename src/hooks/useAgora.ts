import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import AgoraRTC, { AgoraClientType } from "../utils/AgoraEnhancer";
import useMediaStream from "./useMediaStream";

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
      });

      // stream.setVideoProfile('480p_4')

      // Initalize the stream
      await stream.init();

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
    if (!agoraClient) {
      return;
    }

    setIsLoading(true);
    try {
      if (localStream) {
        // Closes the local stream. This de-allocates the resources and turns off the camera light
        localStream.close();
        // unpublish the stream from the client
        agoraClient.unpublish(localStream);
      }
      // leave the channel
      await agoraClient.leave();

      setLocalStream(undefined);
      setRemoteStreamList([]);

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
    if (!agoraClient) {
      return;
    }

    setIsLoading(true);
    try {
      if (localStream) {
        // Publish the stream to the channel.
        await agoraClient.publish(localStream);
        setIsPublished(true);
      }
      enqueueSnackbar("Stream published", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Used to unpublish the stream.
  const unpublish = () => {
    if (!agoraClient) {
      return;
    }

    if (localStream) {
      // unpublish the stream from the client
      agoraClient.unpublish(localStream);
      setIsPublished(false);
      enqueueSnackbar("Stream unpublished", { variant: "info" });
    }
  };

  return {
    localStream,
    remoteStreamList,
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

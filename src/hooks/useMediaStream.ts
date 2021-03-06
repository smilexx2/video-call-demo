import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { AgoraClientType } from "../utils/AgoraEnhancer";

export interface RemoteStream extends AgoraRTC.Stream {
  isAudioMuted: boolean;
}

const useMediaStream = (
  client?: AgoraClientType,
  filter?: (streamId: number) => boolean
) => {
  const [localStream, setLocalStream] = useState<AgoraRTC.Stream | undefined>(
    undefined
  );
  const [remoteStreamList, setRemoteStreamList] = useState<RemoteStream[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let mounted = true;
    // add when subscribed
    const addRemote = (evt: any) => {
      if (!mounted) {
        return;
      }
      const { stream } = evt;
      setRemoteStreamList((streamList) => [...streamList, stream]);
    };
    // remove stream
    const removeRemote = (evt: any) => {
      const { stream } = evt;
      if (stream) {
        const id = stream.getId();
        setRemoteStreamList((streamList) =>
          streamList.filter((item) => item.getId() !== id)
        );
      }
    };
    // subscribe when added
    const doSub = (evt: any) => {
      if (!mounted || !client) {
        return;
      }
      if (filter) {
        if (filter(evt.stream.getId())) {
          client.subscribe(evt.stream, { video: true, audio: true });
        }
      } else {
        client.subscribe(evt.stream, { video: true, audio: true });
      }
    };

    const onStreamPublished = (evt: any) => {
      enqueueSnackbar(`stream published success`, { variant: "info" });
    };

    const onMuteAudio = (evt: any) => {
      setRemoteStreamList((streamList) =>
        streamList.map((stream) => {
          if (stream.getId() === evt.uid) {
            return {
              ...stream,
              isAudioMuted: true,
            };
          }
          return stream;
        })
      );
    };

    const onUnmuteAudio = (evt: any) => {
      setRemoteStreamList((streamList) =>
        streamList.map((stream) => {
          if (stream.getId() === evt.uid) {
            return {
              ...stream,
              isAudioMuted: false,
            };
          }
          return stream;
        })
      );
    };

    if (client) {
      client.on("stream-published", () => onStreamPublished);
      client.on("stream-added", doSub);
      client.on("stream-subscribed", addRemote);
      client.on("peer-leave", removeRemote);
      client.on("stream-removed", removeRemote);
      client.on("mute-audio", onMuteAudio);
      client.on("unmute-audio", onUnmuteAudio);
    }

    return () => {
      mounted = false;
      if (client) {
        // Maintains the list of users based on the various network events.
        client.off("stream-published", onStreamPublished);
        client.off("stream-added", doSub);
        client.off("stream-subscribed", addRemote);
        client.off("peer-leave", removeRemote);
        client.off("stream-removed", removeRemote);
        client.off("mute-audio", onMuteAudio);
      }
    };
  }, [client, filter, enqueueSnackbar]);

  return {
    localStream,
    remoteStreamList,
    setLocalStream,
    setRemoteStreamList,
  };
};

export default useMediaStream;

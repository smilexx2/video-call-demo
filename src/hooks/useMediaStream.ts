import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { AgoraClientType } from "../utils/AgoraEnhancer";

const useMediaStream = (
  client?: AgoraClientType,
  filter?: (streamId: number) => boolean
) => {
  const [localStream, setLocalStream] = useState<AgoraRTC.Stream | undefined>(
    undefined
  );
  const [remoteStreamList, setRemoteStreamList] = useState<AgoraRTC.Stream[]>(
    []
  );
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
        setRemoteStreamList((streamList) => {
          const index = streamList.findIndex((item) => item.getId() === id);
          streamList.splice(index, 1);
          return [...streamList];
        });
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

    if (client) {
      client.on("stream-published", () => onStreamPublished);
      client.on("stream-added", doSub);
      client.on("stream-subscribed", addRemote);
      client.on("peer-leave", removeRemote);
      client.on("stream-removed", removeRemote);
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

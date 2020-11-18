import { useState, useEffect } from "react";
import { AgoraClientType } from "../utils/AgoraEnhancer";

const useMediaStream = (
  client?: AgoraClientType,
  filter?: (streamId: number) => boolean
) => {
  const [localStream, setLocalStream] = useState<any>(undefined);
  const [remoteStreamList, setRemoteStreamList] = useState<any[]>([]);

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
      console.log("removeRemote");
      const { stream } = evt;
      if (stream) {
        const id = stream.getId();
        const index = remoteStreamList.findIndex((item) => item.getId() === id);
        if (index !== -1) {
          setRemoteStreamList((streamList) => {
            streamList.splice(index, 1);
            return streamList;
          });
        }
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
    // add when published
    const addLocal = (evt: any) => {
      if (!mounted) {
        return;
      }
      const { stream } = evt;
      const stop = stream.stop;
      const close = stream.close;
      stream.close = ((func) => () => {
        func();
        setLocalStream(undefined);
      })(close);
      stream.stop = ((func) => () => {
        func();
        setLocalStream(undefined);
      })(stop);
      setLocalStream(stream);
    };

    if (client) {
      client.on("stream-published", addLocal);
      client.on("stream-added", doSub);
      client.on("stream-subscribed", addRemote);
      client.on("peer-leave", removeRemote);
      client.on("stream-removed", removeRemote);
    }

    return () => {
      mounted = false;
      if (client) {
        // Maintains the list of users based on the various network events.
        client.off("stream-published", addLocal);
        client.off("stream-added", doSub);
        client.off("stream-subscribed", addRemote);
        client.off("peer-leave", removeRemote);
        client.off("stream-removed", removeRemote);
      }
    };
  }, [client, filter, remoteStreamList]);

  return {
    localStream,
    remoteStreamList,
    setLocalStream,
    setRemoteStreamList,
  };
};

export default useMediaStream;
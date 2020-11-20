import { useState, useEffect } from "react";
import { AgoraClientType } from "../utils/AgoraEnhancer";

const noop = () => {};

interface MediaDeviceInfo {
  label: string;
  deviceId: string;
}

const useMicrophone = (client?: AgoraClientType): MediaDeviceInfo[] => {
  const [microphoneList, setMicrophoneList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    let mounted = true;

    const onChange = () => {
      if (!client) {
        return;
      }
      client
        .getRecordingDevices()
        .then((microphones: MediaDeviceInfo[]) => {
          if (mounted) {
            setMicrophoneList(microphones);
          }
        })
        .catch(noop);
    };

    client && client.on("recording-device-changed", onChange);
    onChange();

    return () => {
      mounted = false;
      client && client.off("recordingDeviceChanged", onChange);
    };
  }, [client]);

  return microphoneList;
};

export default useMicrophone;

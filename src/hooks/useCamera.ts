import { useEffect, useState } from "react";
import { AgoraClientType } from "../utils/AgoraEnhancer";

const noop = () => {};

interface MediaDeviceInfo {
  label: string;
  deviceId: string;
}

const useCamera = (client?: AgoraClientType): MediaDeviceInfo[] => {
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    let mounted = true;

    const onChange = (_?: any) => {
      if (!client) {
        return;
      }
      client
        .getCameras()
        .then((cameras: MediaDeviceInfo[]) => {
          if (mounted) {
            setCameraList(cameras);
          }
        })
        .catch(noop);
    };

    client && client.on("camera-changed", onChange);

    onChange();

    return () => {
      mounted = false;
      if (client) {
        client.off("camera-changed", onChange);
      }
    };
  }, [client]);

  return cameraList;
};

export default useCamera;

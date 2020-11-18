import AgoraRTC from "agora-rtc-sdk";
import enhanceAgoraRTC from "agoran-awe";
// promisify class Client & Stream
const enhancedAgoraRTC = enhanceAgoraRTC(AgoraRTC);
export type { IClientWithPromise as AgoraClientType } from "agoran-awe/types/promisify";
export default enhancedAgoraRTC;

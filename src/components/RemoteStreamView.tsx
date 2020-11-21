import React from "react";
import StreamPlayer from "agora-stream-player";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { RemoteStream } from "../hooks/useMediaStream";
import MuiMicOffIcon from "@material-ui/icons/MicOff";

const StreamPlayerWrapper = styled.div`
  flex: 1 0 25%;
  position: relative;
`;

const EmptyView = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MicOffIcon = styled(MuiMicOffIcon)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
`;

const RemoteStreamView: React.FunctionComponent<{
  remoteStreamList: RemoteStream[];
}> = ({ remoteStreamList }) => {
  if (remoteStreamList.length === 0) {
    return (
      <EmptyView>
        <Container maxWidth="xs">
          <Typography variant="h4">{"Waiting for others to join."}</Typography>
        </Container>
      </EmptyView>
    );
  }

  return (
    <>
      {remoteStreamList.map((stream) => (
        <StreamPlayerWrapper key={stream.getId()}>
          {stream.isAudioMuted && (
            <MicOffIcon color="secondary" fontSize="large" />
          )}
          <StreamPlayer
            stream={stream}
            fit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </StreamPlayerWrapper>
      ))}
    </>
  );
};

export default RemoteStreamView;

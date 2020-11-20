import React from "react";
import StreamPlayer from "agora-stream-player";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const StreamPlayerWrapper = styled.div`
  flex: 1 0 25%;
`;

const EmptyView = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RemoteStreamView: React.FunctionComponent<{
  remoteStreamList: AgoraRTC.Stream[];
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

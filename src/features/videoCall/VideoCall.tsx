import React from "react";
import { Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import StreamPlayer from "agora-stream-player";
import styled from "styled-components";
import JoinCard from "../../components/JoinCard";
import { useAgora } from "../../hooks";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const DialogContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const BottomPanel = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  z-index: 9999;
`;

const LeftSpace = styled.div`
  flex: 1;
`;

const MiddleSpace = styled.div`
  display: flex;
  align-items: center;
`;

const RightSpace = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const StreamPlayerWrapper = styled.div`
  flex: 1 0 25%;
`;

const VideoCall: React.FunctionComponent = () => {
  const { localStream, remoteStreamList, isJoined, join, leave } = useAgora();

  const handleJoinButtonClick = () => {
    join();
  };

  const handleLeaveButtonClick = () => {
    leave();
  };

  return (
    <>
      <Container>
        <JoinCard onJoinButtonClick={handleJoinButtonClick} />
      </Container>
      <Dialog fullScreen open={isJoined}>
        <DialogContainer>
          {remoteStreamList.map((stream: any) => (
            <StreamPlayerWrapper>
              <StreamPlayer
                key={stream.getId()}
                stream={stream}
                fit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </StreamPlayerWrapper>
          ))}
          <BottomPanel>
            <LeftSpace></LeftSpace>
            <MiddleSpace>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLeaveButtonClick}
              >
                LEAVE
              </Button>
            </MiddleSpace>
            <RightSpace>
              {localStream && (
                <Card style={{ margin: 8 }} variant="outlined">
                  <StreamPlayer stream={localStream} />
                </Card>
              )}
            </RightSpace>
          </BottomPanel>
        </DialogContainer>
      </Dialog>
    </>
  );
};

export default VideoCall;

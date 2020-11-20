import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import StreamPlayer from "agora-stream-player";
import styled from "styled-components";
import JoinCard from "../../components/JoinCard";
import RemoteStreamView from "../../components/RemoteStreamView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useAgora } from "../../hooks";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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

const VideoCall: React.FunctionComponent = () => {
  const {
    localStream,
    remoteStreamList,
    isJoined,
    isPublished,
    join,
    leave,
    publish,
    unpublish,
  } = useAgora();

  const handleJoinButtonClick = () => {
    join();
  };

  const handleLeaveButtonClick = () => {
    leave();
  };

  const handlePublishButton = () => {
    isPublished ? unpublish() : publish();
  };

  return (
    <>
      <Container>
        <JoinCard onJoinButtonClick={handleJoinButtonClick} />
      </Container>
      <Dialog fullScreen open={isJoined}>
        <DialogContainer>
          <RemoteStreamView remoteStreamList={remoteStreamList} />
          <BottomPanel>
            <LeftSpace></LeftSpace>
            <MiddleSpace>
              <ButtonGroup disableElevation variant="contained">
                <Button onClick={handlePublishButton}>
                  {isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button color="secondary" onClick={handleLeaveButtonClick}>
                  LEAVE
                </Button>
              </ButtonGroup>
            </MiddleSpace>
            <RightSpace>
              {localStream && (
                <Card style={{ margin: 8 }} variant="outlined">
                  <StreamPlayer video={isPublished} stream={localStream} />
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

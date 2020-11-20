import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { RootState } from "../../app/store";
import JoinCard from "../../components/JoinCard";
import RemoteStreamView from "../../components/RemoteStreamView";
import { useAgora } from "../../hooks";
import { updateState } from "./videoCallSlice";

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
  height: 196px;
  display: flex;
  justify-content: center;
  z-index: 9999;
`;

const ButtonGroupWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LocalVideoPlaceholder = styled(Card)<{ isJoined: boolean }>`
  width: 240px;
  height: 180px;
  margin: 8px;
  position: absolute;
  z-index: 9999;
  bottom: 0;
  right: 0;
  ${({ isJoined }) =>
    !isJoined &&
    css`
      display: none;
    `}
`;

const VideoCall: React.FunctionComponent = () => {
  const {
    remoteStreamList,
    cameraList,
    microphoneList,
    isJoined,
    isPublished,
    join,
    leave,
    publish,
    unpublish,
  } = useAgora();

  const [isSettingOpen, setSettingOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { cameraId, microphoneId } = useSelector(
    (state: RootState) => state.videoCall
  );

  React.useEffect(() => {
    dispatch(
      updateState({
        name: "cameraId",
        value: cameraList[0]?.deviceId,
      })
    );
  }, [dispatch, cameraList]);

  React.useEffect(() => {
    dispatch(
      updateState({
        name: "microphoneId",
        value: microphoneList[0]?.deviceId,
      })
    );
  }, [dispatch, microphoneList]);

  const handleJoinButtonClick = () => {
    join();
  };

  const handleLeaveButtonClick = () => {
    leave();
  };

  const handlePublishButtonClick = async () => {
    isPublished ? unpublish() : publish();
  };

  const handleSettingButtonClick = () => {
    setSettingOpen(true);
  };

  const handleDialogClose = () => {
    setSettingOpen(false);
  };

  const update = (e: React.ChangeEvent<unknown>) => {
    return dispatch(
      updateState({
        name: (e.target as HTMLInputElement).name,
        value: (e.target as HTMLInputElement).value,
      })
    );
  };

  return (
    <>
      <Container>
        <JoinCard onJoinButtonClick={handleJoinButtonClick} />
      </Container>
      <Dialog fullScreen open={isJoined} fullWidth>
        <DialogContainer>
          <RemoteStreamView remoteStreamList={remoteStreamList} />
          <BottomPanel>
            <ButtonGroupWrapper>
              <ButtonGroup disableElevation variant="contained">
                <Button onClick={handleSettingButtonClick}>Settings</Button>
                <Button onClick={handlePublishButtonClick}>
                  {isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button color="secondary" onClick={handleLeaveButtonClick}>
                  LEAVE
                </Button>
              </ButtonGroup>
            </ButtonGroupWrapper>
          </BottomPanel>
        </DialogContainer>
      </Dialog>
      <Dialog open={isSettingOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <TextField
            id="cameraId"
            name="cameraId"
            value={cameraId || ""}
            onChange={update}
            select
            label="Camera"
            helperText="Please select your camera"
            fullWidth
            margin="normal"
          >
            {cameraList.map((item) => (
              <MenuItem key={item.deviceId} value={item.deviceId}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="microphoneId"
            name="microphoneId"
            value={microphoneId || ""}
            onChange={update}
            select
            label="Microphone"
            helperText="Please select your microphone"
            fullWidth
            margin="normal"
          >
            {microphoneList.map((item) => (
              <MenuItem key={item.deviceId} value={item.deviceId}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
      </Dialog>
      <LocalVideoPlaceholder
        variant="outlined"
        id="local_stream"
        isJoined={isJoined}
      />
    </>
  );
};

export default VideoCall;

import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { RootState } from "../../app/store";
import ChannelCard from "../../components/ChannelCard";
import ConfigureChannelForm from "../../components/ConfigureChannelForm";
import RemoteStreamView from "../../components/RemoteStreamView";
import { useAgora } from "../../hooks";
import { updateState } from "./videoCallSlice";
import AppFooter from "../../components/AppFooter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const LocalVideoPlaceholder = styled(({ isJoined, ...rest }) => (
  <Card {...rest} />
))<{ isJoined: boolean }>`
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

const ConfigureChannelFab = styled(Fab)`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const VideoCall: React.FunctionComponent = () => {
  const {
    remoteStreamList,
    cameraList,
    microphoneList,
    isJoined,
    isPublished,
    isVideoMuted,
    isAudioMuted,
    join,
    leave,
    publish,
    unpublish,
    muteVideo,
    unMuteVideo,
    muteAudio,
    unMuteAudio,
  } = useAgora();

  const [isSettingOpen, setSettingOpen] = React.useState(false);
  const [isConfigureChannelOpen, setConfigureChannelOpen] = React.useState(
    false
  );

  const dispatch = useDispatch();
  const { cameraId, microphoneId, isChannelConfigured } = useSelector(
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

  const handleConfigureButtonClick = () => {
    setConfigureChannelOpen(true);
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

  const handleSettingDialogClose = () => {
    setSettingOpen(false);
  };

  const handleConfigureDialogClose = () => {
    setConfigureChannelOpen(false);
  };

  const handleVideoButtonClick = () => {
    isVideoMuted ? unMuteVideo() : muteVideo();
  };

  const handleMicButtonClick = () => {
    isAudioMuted ? unMuteAudio() : muteAudio();
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
        <ChannelCard>
          {isChannelConfigured ? (
            <Button
              onClick={handleJoinButtonClick}
              variant="contained"
              fullWidth
              color="primary"
            >
              Join Channel
            </Button>
          ) : (
            <Button
              onClick={handleConfigureButtonClick}
              fullWidth
              variant="contained"
              disableElevation
            >
              Configure Channel
            </Button>
          )}
        </ChannelCard>
        <AppFooter />
      </Container>
      <Dialog
        fullScreen
        open={isJoined}
        fullWidth
        data-testid="video-call-dialog"
      >
        <DialogContainer>
          <RemoteStreamView remoteStreamList={remoteStreamList} />
          <BottomPanel>
            <ButtonGroupWrapper>
              <ButtonGroup disableElevation variant="contained">
                <Button
                  onClick={handleSettingButtonClick}
                  data-testid="settings-button"
                >
                  Settings
                </Button>
                <Button onClick={handleMicButtonClick} data-testid="mic-button">
                  {isAudioMuted ? (
                    <MicOffIcon data-testid="mic-off-icon" />
                  ) : (
                    <MicIcon data-testid="mic-on-icon" />
                  )}
                </Button>
                <Button
                  onClick={handleVideoButtonClick}
                  data-testid="video-button"
                >
                  {isVideoMuted ? (
                    <VideocamOffIcon data-testid="video-off-icon" />
                  ) : (
                    <VideocamIcon data-testid="video-on-icon" />
                  )}
                </Button>
                <Button
                  onClick={handlePublishButtonClick}
                  data-testid="publish-button"
                >
                  {isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  color="secondary"
                  onClick={handleLeaveButtonClick}
                  data-testid="leave-button"
                >
                  LEAVE
                </Button>
              </ButtonGroup>
            </ButtonGroupWrapper>
          </BottomPanel>
        </DialogContainer>
      </Dialog>
      <Dialog
        open={isSettingOpen}
        onClose={handleSettingDialogClose}
        fullWidth
        data-testid="settings-dialog"
      >
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
            SelectProps={{
              SelectDisplayProps: {
                // @ts-ignore
                "data-testid": "camera-select",
              },
            }}
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
      <Dialog open={isConfigureChannelOpen} data-testid="configure-dialog">
        <ConfigureChannelForm onDialogClose={handleConfigureDialogClose} />
      </Dialog>
      {isChannelConfigured && (
        <ConfigureChannelFab
          variant="extended"
          onClick={handleConfigureButtonClick}
          data-testid="configure-fab"
        >
          <EditIcon style={{ marginRight: 8 }} />
          Configure Channel
        </ConfigureChannelFab>
      )}
      <LocalVideoPlaceholder
        variant="outlined"
        id="local_stream"
        isJoined={isJoined}
      />
    </>
  );
};

export default VideoCall;

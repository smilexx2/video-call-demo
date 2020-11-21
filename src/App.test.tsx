import React from "react";
import { render, screen, waitFor } from "./test-utils";
import userEvent from "@testing-library/user-event";
import App from "./App";
import AgoraRTC from "./utils/AgoraEnhancer";

jest.mock("./utils/AgoraEnhancer", () => ({}));

beforeEach(() => {
  AgoraRTC.createClient = jest.fn().mockReturnValue({
    init: jest.fn(),
    on: jest.fn(),
    getCameras: jest.fn(() =>
      Promise.resolve([
        {
          deviceId: "1",
          groupId:
            "e7045880b94b5011569d67179bfe36b3216bac68a2e21bf5457bca2f20202430",
          kind: "videoinput",
          label: "FaceTime HD Camera Front",
        },
        {
          deviceId: "2",
          groupId:
            "e7045880b94b5011569d67179bfe36b3216bac68a2e21bf5457bca2f20202430",
          kind: "videoinput",
          label: "FaceTime HD Camera Back",
        },
      ])
    ),
    getRecordingDevices: jest.fn(() =>
      Promise.resolve([
        {
          deviceId: "default",
          groupId:
            "78a63285a62723057fae29b0d40ffa102d8ba26d90b07389c0f419f92216d9f1",
          kind: "audioinput",
          label: "Default - External Microphone (Built-in)",
        },
      ])
    ),
    off: jest.fn(),
    join: jest.fn(),
    publish: jest.fn(),
    leave: jest.fn(() => Promise.resolve()),
    unpublish: jest.fn(),
  });
  AgoraRTC.createStream = jest.fn().mockReturnValue({
    init: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    play: jest.fn(),
    isPlaying: jest.fn(),
    close: jest.fn(),
    switchDevice: jest.fn(),
    muteVideo: jest.fn(),
    unmuteVideo: jest.fn(),
    muteAudio: jest.fn(),
    unmuteAudio: jest.fn(),
  });
});

test("renders configure channel button", () => {
  render(<App />);
  const configureChannelButton = screen.getByText(/Configure Channel/i);
  expect(configureChannelButton).toBeInTheDocument();
});

test("given configure channel button -> when click on it -> it should render three text fields and a save button", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdLabel = await screen.findByText("App ID");
  const channelLabel = await screen.findByText("Channel");
  const tokenLabel = await screen.findByText("Token");
  const saveButton = await screen.findByText("Save");
  const joinButton = await waitFor(() => screen.queryByText("Join Channel"));

  expect(appIdLabel).toBeInTheDocument();
  expect(channelLabel).toBeInTheDocument();
  expect(tokenLabel).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
  expect(joinButton).not.toBeInTheDocument();
});

test("given the configuration form -> when fill in and save it -> it should render a join button and a configure fab button", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");
  const configureFab = await screen.findByTestId("configure-fab");

  expect(joinButton).toBeInTheDocument();
  expect(configureFab).toBeInTheDocument();
});

test("given the configure fab button -> when click on it -> it should open the configuration dialog", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const configureFab = await screen.findByTestId("configure-fab");

  userEvent.click(configureFab);

  const configureDialog = await screen.findByTestId("configure-dialog");

  expect(configureDialog).toBeInTheDocument();
});

test("given the configure dialog is open -> when click on the close button -> it should close the configuration dialog", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const configureFab = await screen.findByTestId("configure-fab");

  userEvent.click(configureFab);

  const configureDialog = await screen.findByTestId("configure-dialog");
  const closeButton = await screen.findByTestId("close-button");

  expect(configureDialog).toBeInTheDocument();

  userEvent.click(closeButton);

  await waitFor(() => expect(configureDialog).not.toBeInTheDocument());
});

test("given the configure dialog is open -> when click on the remove button -> it should render a configure button", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const configureFab = await screen.findByTestId("configure-fab");

  userEvent.click(configureFab);

  const configureDialog = await screen.findByTestId("configure-dialog");
  const removeButton = await screen.findByTestId("remove-button");

  expect(configureDialog).toBeInTheDocument();

  userEvent.click(removeButton);

  await waitFor(() => expect(configureDialog).not.toBeInTheDocument());

  expect(screen.getByText(/Configure Channel/i)).toBeInTheDocument();
  expect(screen.queryByText("Join Channel")).not.toBeInTheDocument();
});

test("given the valid channel configuration -> when click on the join button -> it should open the video call dialog", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const videoCallDialog = await screen.findByTestId("video-call-dialog");
  const leaveSpan = await screen.findByText("LEAVE");
  const settingsSpan = await screen.findByText("Settings");
  const unpublishSpan = await screen.findByText("Unpublish");

  expect(videoCallDialog).toBeInTheDocument();
  expect(leaveSpan).toBeInTheDocument();
  expect(settingsSpan).toBeInTheDocument();
  expect(unpublishSpan).toBeInTheDocument();
});

test("given video call dialog is open -> when click on the leave button -> it should close the video call dialog", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const leaveButton = await screen.findByTestId("leave-button");
  const videoCallDialog = await screen.findByTestId("video-call-dialog");

  userEvent.click(leaveButton);

  await waitFor(() => expect(videoCallDialog).not.toBeInTheDocument());
});

test("given video call dialog is open -> when click on the publish button -> it should toggle", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const publishButton = await screen.findByTestId("publish-button");
  expect(publishButton).toHaveTextContent("Unpublish");

  userEvent.click(publishButton);

  await waitFor(() => expect(publishButton).toHaveTextContent("publish"));

  userEvent.click(publishButton);

  await waitFor(() => expect(publishButton).toHaveTextContent("Unpublish"));
});

test("given video call dialog is open -> when click on the settings button -> it should open the settings dialog", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const settingsButton = await screen.findByTestId("settings-button");

  userEvent.click(settingsButton);

  const settingsDialog = await screen.findByTestId("settings-dialog");

  await waitFor(() => expect(settingsDialog).toBeInTheDocument());
});

test("given settings dialog is open -> when click on the camera select -> it should select the camera", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const settingsButton = await screen.findByTestId("settings-button");

  userEvent.click(settingsButton);

  const cameraSelect = await screen.findByTestId("camera-select");
  expect(cameraSelect).toHaveTextContent("FaceTime HD Camera Front");

  userEvent.click(cameraSelect);

  const listItem = await screen.findByRole("option", {
    name: "FaceTime HD Camera Back",
  });

  userEvent.click(listItem);

  await waitFor(() =>
    expect(cameraSelect).toHaveTextContent("FaceTime HD Camera Back")
  );
});

test("given camera toggle button is visible -> when click on the button -> it should toggle", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const videoButton = await screen.findByTestId("video-button");
  const videoOnIcon = await screen.findByTestId("video-on-icon");

  userEvent.click(videoButton);

  const videoOffIcon = await screen.findByTestId("video-off-icon");

  expect(videoOnIcon).not.toBeInTheDocument();
  expect(videoOffIcon).toBeInTheDocument();
});

test("given mic toggle button is visible -> when click on the button -> it should toggle", async () => {
  render(<App />);
  userEvent.click(screen.getByText(/Configure Channel/i));

  const appIdInput = await screen.findByTestId("appId-input");
  const channelInput = await screen.findByTestId("channel-input");
  const tokenInput = await screen.findByTestId("token-input");
  const saveButton = await screen.findByText("Save");

  userEvent.type(appIdInput, "12345");
  userEvent.type(channelInput, "test");
  userEvent.type(tokenInput, "0064b32d");
  userEvent.click(saveButton);

  const joinButton = await screen.findByText("Join Channel");

  userEvent.click(joinButton);

  const videoButton = await screen.findByTestId("mic-button");
  const videoOnIcon = await screen.findByTestId("mic-on-icon");

  userEvent.click(videoButton);

  const videoOffIcon = await screen.findByTestId("mic-off-icon");

  expect(videoOnIcon).not.toBeInTheDocument();
  expect(videoOffIcon).toBeInTheDocument();
});

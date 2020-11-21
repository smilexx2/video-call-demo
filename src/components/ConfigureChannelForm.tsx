import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as Yup from "yup";
import { RootState } from "../app/store";
import {
  configureChannel,
  setChannelConfigured,
} from "../features/videoCall/videoCallSlice";

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const ConfigureChannelSchema = Yup.object().shape({
  appId: Yup.string().required("Required"),
  channel: Yup.string().required("Required"),
  token: Yup.string().required("Required"),
});

const ConfigureChannelForm: React.FunctionComponent<{
  onDialogClose: () => void;
}> = ({ onDialogClose }) => {
  const dispatch = useDispatch();
  const { appId, channel, token, isChannelConfigured } = useSelector(
    (state: RootState) => state.videoCall
  );

  const initialValues = isChannelConfigured
    ? { appId, channel, token }
    : { appId: "", channel: "", token: "" };

  const formik = useFormik({
    initialValues,
    onSubmit: async ({ appId, channel, token }) => {
      localStorage.setItem("appId", appId);
      localStorage.setItem("channel", channel);
      localStorage.setItem("token", token);
      localStorage.setItem("isChannelConfigured", JSON.stringify(true));
      dispatch(configureChannel({ appId, channel, token }));
      dispatch(setChannelConfigured(true));
      onDialogClose();
    },
    validationSchema: ConfigureChannelSchema,
  });

  const handleCancelButtonClick = async () => {
    formik.resetForm();
    onDialogClose();
  };

  const handleRemoveButtonClick = async () => {
    localStorage.removeItem("appId");
    localStorage.removeItem("channel");
    localStorage.removeItem("token");
    localStorage.removeItem("isChannelConfigured");
    dispatch(setChannelConfigured(false));
    onDialogClose();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>
        Configure Channel{" "}
        <CloseButton
          aria-label="close"
          onClick={handleCancelButtonClick}
          data-testid="close-button"
        >
          <CloseIcon />
        </CloseButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          id="appId"
          name="appId"
          inputProps={{
            "data-testid": "appId-input",
          }}
          value={formik.values.appId}
          error={!!(formik.touched.appId && formik.errors.appId)}
          helperText={formik.touched.appId && formik.errors.appId}
          onChange={formik.handleChange}
          label="App ID"
          fullWidth
          margin="normal"
        />
        <TextField
          id="channel"
          name="channel"
          inputProps={{
            "data-testid": "channel-input",
          }}
          value={formik.values.channel}
          error={!!(formik.touched.channel && formik.errors.channel)}
          helperText={formik.touched.channel && formik.errors.channel}
          onChange={formik.handleChange}
          label="Channel"
          fullWidth
          margin="normal"
        />
        <TextField
          id="token"
          name="token"
          inputProps={{
            "data-testid": "token-input",
          }}
          value={formik.values.token}
          error={!!(formik.touched.token && formik.errors.token)}
          helperText={formik.touched.token && formik.errors.token}
          onChange={formik.handleChange}
          label="Token"
          fullWidth
          multiline
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        {isChannelConfigured && (
          <Button
            color="secondary"
            onClick={handleRemoveButtonClick}
            data-testid="remove-button"
          >
            Remove
          </Button>
        )}
        <Button type="submit" color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default ConfigureChannelForm;

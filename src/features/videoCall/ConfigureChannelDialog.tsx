import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import * as Yup from "yup";
import { configureChannel, setChannelConfigured } from "./videoCallSlice";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

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

const ConfigureChannelDialog: React.FunctionComponent<{
  isDialogOpen: boolean;
  onDialogClose: () => void;
}> = ({ isDialogOpen, onDialogClose }) => {
  const dispatch = useDispatch();
  const { appId, channel, token, isChannelConfigured } = useSelector(
    (state: RootState) => state.videoCall
  );
  const formik = useFormik({
    initialValues: {
      appId: appId || "",
      channel: channel || "",
      token: token || "",
    },
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

  const handleCancelButtonClick = () => {
    onDialogClose();
    if (!isChannelConfigured) {
      formik.resetForm();
    }
  };

  const handleRemoveButtonClick = async () => {
    localStorage.removeItem("appId");
    localStorage.removeItem("channel");
    localStorage.removeItem("token");
    localStorage.removeItem("isChannelConfigured");
    onDialogClose();
    dispatch(setChannelConfigured(false));
    await formik.setValues({
      appId: "",
      channel: "",
      token: "",
    });
    await formik.setTouched({
      appId: false,
      channel: false,
      token: false,
    });
  };

  return (
    <Dialog open={isDialogOpen}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          Configure Channel{" "}
          <CloseButton aria-label="close" onClick={handleCancelButtonClick}>
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            id="appId"
            name="appId"
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
            <Button color="secondary" onClick={handleRemoveButtonClick}>
              Remove
            </Button>
          )}
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ConfigureChannelDialog;

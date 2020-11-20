import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";

const JoinButtonGroup: React.FunctionComponent<{
  onJoinButtonClick: () => void;
  onConfigureButtonClick: () => void;
  onRemoveButtonClick: () => void;
}> = ({ onJoinButtonClick, onConfigureButtonClick, onRemoveButtonClick }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleConfigureButtonClick = () => {
    onConfigureButtonClick();
    setOpen(false);
  };

  const handleRemoveButtonClick = () => {
    onRemoveButtonClick();
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup variant="contained" color="primary" fullWidth>
        <Button onClick={onJoinButtonClick}>Join Channel</Button>
        <Button
          ref={anchorRef}
          color="primary"
          size="small"
          onClick={handleToggle}
          style={{ flex: 0 }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" disablePadding>
                  <MenuItem
                    key="configure"
                    onClick={handleConfigureButtonClick}
                  >
                    <Typography variant="inherit" color="primary">
                      Configure Channel
                    </Typography>
                  </MenuItem>
                  <MenuItem key="remove" onClick={handleRemoveButtonClick}>
                    <Typography variant="inherit" color="secondary">
                      Remove
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default JoinButtonGroup;

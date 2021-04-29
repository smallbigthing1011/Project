import {
  Box,
  IconButton,
  makeStyles,
  Tooltip,
  ClickAwayListener,
  Button,
} from "@material-ui/core";
import FileCopySharpIcon from "@material-ui/icons/FileCopySharp";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
});

export default function RoomInfo({ members, fileList, roomid, roomCall }) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    navigator.clipboard.writeText(roomid);
    setOpen(true);
  };

  const handleClickJoin = () => {
    history.push(`/video/${roomCall}`);
  };
  useEffect(() => {
    console.log(members);
    console.log(fileList);
  }, []);
  return (
    <div className={classes.root}>
      <Box className={classes.root}>
        {roomCall && <Button onClick={handleClickJoin}>Join</Button>}
        <Box>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="Copied!"
              >
                <IconButton
                  style={{ color: "rgb(255,255,255)" }}
                  onClick={handleTooltipOpen}
                >
                  <FileCopySharpIcon></FileCopySharpIcon>
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Box>
      </Box>
    </div>
  );
}

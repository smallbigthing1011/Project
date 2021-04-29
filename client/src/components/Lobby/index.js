import {
  Box,
  Button,
  createMuiTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Snackbar,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "rgb(255,255,255)",
    },
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  margin: {
    margin: theme.spacing(1),
  },
  dialog: {
    backgroundColor: "rgb(37,39,43)",
    color: "rgb(255,255,255)",
  },
  roomlist: {
    width: "100%",
    textDecoration: "none",
  },
  link: {
    textDecoration: "none",
    color: "rgb(255,255,255)",
  },
  item: {
    width: "100%",
  },
}));
export default function Lobby() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [join, setJoin] = useState(false);
  const [roomname, setRoomname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [roomlist, setRoomlist] = useState([]);
  const history = useHistory();
  const cookie = document.cookie;
  const cookieData = JSON.parse(cookie);
  useEffect(() => {
    const cookie = document.cookie;
    const cookieData = JSON.parse(cookie);
    const fetchData = async () => {
      const roomData = await (
        await fetch(`http://localhost:3000/room/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: cookieData.token,
          },
        })
      ).json();
      if (!roomData.message) {
        setRoomlist(roomData);
      }
    };
    fetchData();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenRoomId = () => {
    setJoin(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseRoomId = () => {
    setJoin(false);
  };
  const handleChangeRoomname = (event) => {
    setRoomname(event.target.value);
  };
  const handleChangeRoomId = (event) => {
    setRoomId(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const cookie = document.cookie;
    const cookieData = JSON.parse(cookie);

    const roomData = await (
      await fetch(`http://localhost:3000/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookieData.token,
        },
        body: JSON.stringify({
          name: roomname,
        }),
      })
    ).json();
    if (roomData.message) {
      setMessage(roomData.message);
      setOpen(true);
    } else {
      setRoomlist([...roomlist, { room: roomData.room }]);
      setOpen(false);
    }
  };

  const handleSubmitRoomId = async (event) => {
    event.preventDefault();
    const cookie = document.cookie;
    const cookieData = JSON.parse(cookie);

    const roomData = await (
      await fetch(`http://localhost:3000/subscription/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookieData.token,
        },
      })
    ).json();
    if (roomData.message) {
      setMessage(roomData.message);
      setSnackbarOpen(true);
    } else {
      const roomListData = await (
        await fetch(`http://localhost:3000/room/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: cookieData.token,
          },
        })
      ).json();
      setRoomlist(roomListData);
      setOpen(false);
    }
  };
  const handleClickLogout = () => {
    document.cookie = `${cookieData}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    history.push("/");
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={handleCloseSnackbar}
        message={message}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={handleCloseSnackbar}
            >
              Close
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <ThemeProvider theme={theme}>
        <IconButton
          aria-label="create"
          className={classes.margin}
          color="secondary"
          onClick={handleClickOpen}
        >
          <AddRoundedIcon fontSize="medium" />
        </IconButton>
      </ThemeProvider>
      <ThemeProvider theme={theme}>
        <IconButton
          aria-label="join"
          className={classes.margin}
          color="secondary"
          onClick={handleClickOpenRoomId}
        >
          <MeetingRoomRoundedIcon fontSize="medium" />
        </IconButton>
      </ThemeProvider>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "rgb(37,39,43)",
            color: "rgb(255,255,255)",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Room</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "rgb(255,255,255)" }}>
              To create a new room, please enter a room name. Remember that your
              room name must be unique
            </DialogContentText>
            <ThemeProvider theme={theme}>
              <TextField
                autoFocus
                margin="dense"
                id="roomname"
                label="Room Name"
                type="text"
                fullWidth
                color="secondary"
                InputProps={{
                  style: {
                    color: "rgb(255,255,255)",
                  },
                }}
                onChange={handleChangeRoomname}
              />
            </ThemeProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={join}
        onClose={handleCloseRoomId}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "rgb(37,39,43)",
            color: "rgb(255,255,255)",
          },
        }}
      >
        <form onSubmit={handleSubmitRoomId}>
          <DialogTitle id="form-dialog-title">Room</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "rgb(255,255,255)" }}>
              To join a room, please paste a room Id.
            </DialogContentText>
            <ThemeProvider theme={theme}>
              <TextField
                autoFocus
                margin="dense"
                id="roomid"
                label="Room Id"
                type="text"
                fullWidth
                color="secondary"
                InputProps={{
                  style: {
                    color: "rgb(255,255,255)",
                  },
                }}
                onChange={handleChangeRoomId}
              />
            </ThemeProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRoomId} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Box style={{ width: "100%" }}>
        <List className={classes.roomlist}>
          {roomlist.length > 0
            ? roomlist.map((item) => {
                return (
                  <Link
                    to={`/channel/${item.room._id}`}
                    className={classes.link}
                  >
                    <ListItem button className={classes.item}>
                      <ListItemText primary={item.room.name} />
                    </ListItem>
                  </Link>
                );
              })
            : ""}
        </List>
        <Button
          onClick={handleClickLogout}
          style={{ color: "rgb(255,255,255)" }}
        >
          Logout
        </Button>
      </Box>
    </div>
  );
}

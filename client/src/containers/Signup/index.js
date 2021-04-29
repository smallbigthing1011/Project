import {
  Box,
  Button,
  createMuiTheme,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Snackbar,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import background from "../../images/background2.jpg";
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "rgb(255,255,255)",
    },
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    background: `url("${background}") no-repeat center`,
    backgroundSize: "cover",
    position: "relative",
    color: "white",
  },
  form: {
    maxHeight: "300px",
    minHeight: "40%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "rgb(54,57,63)",
  },
  component: {
    "& .MuiFormLabel-root": {
      color: "rgb(255,255,255)",
    },
    marginBottom: "20px",
  },
  divider: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "20px",
  },
}));
export default function Signup() {
  const classes = useStyles();
  const [account, setAccount] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const accountData = await (
      await fetch(`http://localhost:3000/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      })
    ).json();
    if (accountData.message) {
      setMessage(accountData.message);
      setOpen(true);
    } else {
      const accountLogin = await (
        await fetch(`http://localhost:3000/user/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(account),
        })
      ).json();
      const me = await (
        await fetch(`http://localhost:3000/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: accountLogin.token,
          },
        })
      ).json();
      const accountCookie = {
        token: accountLogin.token,
        me,
      };
      document.cookie = JSON.stringify(accountCookie);
      history.push("/channel");
    }
    console.log(accountData);
  };
  const handleChange = (event) => {
    const accountInfo = { ...account };
    accountInfo[event.target.name] = event.target.value;
    setAccount(accountInfo);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              Close
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Box
        component={Paper}
        padding={3}
        className={classes.form}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <form onSubmit={handleSubmit}>
          <ThemeProvider theme={theme}>
            <TextField
              variant="outlined"
              label="Username"
              fullWidth
              onChange={handleChange}
              className={classes.component}
              name="username"
            ></TextField>
            <TextField
              variant="outlined"
              label="Password"
              fullWidth
              className={classes.component}
              onChange={handleChange}
              name="password"
            ></TextField>
            <TextField
              variant="outlined"
              label="Name"
              fullWidth
              className={classes.component}
              onChange={handleChange}
              name="name"
            ></TextField>
          </ThemeProvider>
          <Divider className={classes.divider}></Divider>

          <Button
            fullWidth
            color="primary"
            variant="contained"
            className={classes.component}
            type="submit"
          >
            Sign-up
          </Button>
        </form>
      </Box>
    </div>
  );
}

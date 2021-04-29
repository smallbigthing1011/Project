import {
  Box,
  Button,
  createMuiTheme,
  Divider,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
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
export default function Login() {
  const classes = useStyles();
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
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
      await fetch(`http://localhost:3000/user/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      })
    ).json();
    if (accountData.message) {
      setOpen(true);
    } else {
      const me = await (
        await fetch(`http://localhost:3000/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: accountData.token,
          },
        })
      ).json();
      const accountCookie = {
        token: accountData.token,
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
        message="Invalid Email or Password"
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
              color="secondary"
              onChange={handleChange}
              className={classes.component}
              name="username"
            ></TextField>
            <TextField
              variant="outlined"
              label="Password"
              fullWidth
              color="secondary"
              className={classes.component}
              onChange={handleChange}
              name="password"
              type="password"
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
            Login
          </Button>

          <Link to="/signup">
            <Button
              fullWidth
              color="primary"
              variant="contained"
              className={classes.component}
            >
              Sign-up
            </Button>
          </Link>
        </form>
      </Box>
    </div>
  );
}

import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Lobby, Room } from "../../components";

const useStyles = makeStyles({
  root: {
    position: "relative",
  },
  lobby: {
    position: "fixed",
    height: "100vh",
    backgroundColor: "rgb(37,39,43)",
    border: "3px solid rgb(98,45,141)",
    borderTop: "0",
    borderBottom: "0",
    borderLeft: "0",
  },
  room: {
    backgroundColor: "rgb(47,49,54)",
    height: "100vh",
    overflow: "hidden",
  },

  lobbyItem: {
    width: "100%",
  },
});
const routes = [
  {
    path: "/channel/:roomid",
    exact: false,
    main: () => <Room></Room>,
  },
];

export default function Channel() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        xs={2}
        sm={2}
        md={2}
        lg={2}
        item
        container
        className={classes.lobby}
      >
        <Lobby className={classes.lobbyItem}></Lobby>
      </Grid>
      <Grid container>
        <Grid xs={2} sm={2} md={2} lg={2} item></Grid>
        <Grid xs={10} sm={10} md={10} lg={10} item className={classes.room}>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
            ))}
          </Switch>
        </Grid>
      </Grid>
    </div>
  );
}

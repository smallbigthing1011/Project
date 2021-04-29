import "./App.css";
import { Switch, Route } from "react-router-dom";
import { Login, Signup, Channel } from "./containers";
import { RoomVideo } from "./components";
function App() {
  const routes = [
    {
      path: "/",
      exact: true,
      main: () => <Login></Login>,
    },
    {
      path: "/signup",
      exact: false,
      main: () => <Signup></Signup>,
    },
    {
      path: "/channel",
      exact: false,
      main: () => <Channel></Channel>,
    },
    {
      path: "/video/:roomcall",
      exact: false,
      main: () => <RoomVideo></RoomVideo>,
    },
  ];

  return (
    <div className="App">
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
    </div>
  );
}

export default App;

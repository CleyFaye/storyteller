import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import MainMenu from "./pages/mainmenu";
import Camera from "./pages/camera";

export default class App extends React.Component {
  render() {
    return <BrowserRouter
      basename="/app/stasis"
    >
      <Switch>
        <Route path="/mainmenu" component={MainMenu} />
        <Route path="/camera" component={Camera} />
        <Redirect to="/mainmenu" />
      </Switch>
    </BrowserRouter>;
  }
}

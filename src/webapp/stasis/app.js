import React from "react";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";

import Camera from "./pages/camera.js";
import MainMenu from "./pages/mainmenu.js";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename="/app/stasis">
        <Switch>
          <Route component={MainMenu} path="/mainmenu" />
          <Route component={Camera} path="/camera" />
          <Redirect to="/mainmenu" />
        </Switch>
      </BrowserRouter>
    );
  }
}

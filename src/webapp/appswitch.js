import React from "react";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";

import StoryApp from "./app.js";
import AppSelect from "./appselect.js";
import StasisApp from "./stasis/app.js";

export default class AppSwitch extends React.PureComponent {
  render = () => (
    <BrowserRouter basename="/app">
      <Switch>
        <Route component={AppSelect} path="/select" />
        <Route component={StoryApp} path="/story" />
        <Route component={StasisApp} path="/stasis" />
        <Redirect to="/select" />
      </Switch>
    </BrowserRouter>
  );
}

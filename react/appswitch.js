import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import StoryApp from "./app";
import StasisApp from "./stasis/app";
import AppSelect from "./appselect";

export default class AppSwitch extends React.Component {
  render() {
    return <BrowserRouter>
      <div>Select app:</div>
      <Switch>
        <Route path="/select" component={AppSelect} />
        <Route path="/story" component={StoryApp} />
        <Route path="/stasis" component={StasisApp} />
        <Redirect to="/select" />
      </Switch>
    </BrowserRouter>;
  }
}

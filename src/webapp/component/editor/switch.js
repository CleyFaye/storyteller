import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import FileManager from "./filemanager.js";
import Load from "./load.js";
import New from "./new.js";
import Sequence from "./sequence.js";
import Setting from "./setting.js";
import Welcome from "./welcome.js";

class EditorSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route component={Welcome} path="/editor/welcome" />
        <Route component={New} path="/editor/new" />
        <Route component={Sequence} path="/editor/sequence" />
        <Route component={Load} path="/editor/load" />
        <Route component={Setting} path="/editor/settings" />
        <Route component={FileManager} path="/editor/filemanager" />
        <Redirect to="/editor/welcome" />
      </Switch>
    );
  }
}

export default EditorSwitch;

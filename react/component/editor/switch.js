import React from "react";
import {Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {Redirect} from "react-router-dom";
import Welcome from "./welcome";

class EditorSwitch extends React.Component {
  render() {
    return <Switch>
      <Route path="/editor" component={Welcome} />
      <Redirect to="/editor" />
    </Switch>;
  }
}

export default EditorSwitch;
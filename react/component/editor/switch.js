import React from "react";
import {Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {Redirect} from "react-router-dom";
import Welcome from "./welcome";
import New from "./new";
import Sequence from "./sequence";
import Load from "./load";

class EditorSwitch extends React.Component {
  render() {
    return <Switch>
      <Route exact path="/editor" component={Welcome} />
      <Route exact path="/editor/new" component={New} />
      <Route exact path="/editor/sequence" component={Sequence} />
      <Route exact path="/editor/load" component={Load} />
      <Redirect to="/editor" />
    </Switch>;
  }
}

export default EditorSwitch;
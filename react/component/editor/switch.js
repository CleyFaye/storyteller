import React from "react";
import {Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {Redirect} from "react-router-dom";
import Welcome from "./welcome";
import New from "./new";
import Sequence from "./sequence";
import Load from "./load";
import Setting from "./setting";

class EditorSwitch extends React.Component {
  render() {
    return <Switch>
      <Route path="/editor/welcome" component={Welcome} />
      <Route path="/editor/new" component={New} />
      <Route path="/editor/sequence" component={Sequence} />
      <Route path="/editor/load" component={Load} />
      <Route path="/editor/settings" component={Setting} />
      <Redirect to="/editor/welcome" />
    </Switch>;
  }
}

export default EditorSwitch;
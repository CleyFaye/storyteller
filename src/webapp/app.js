import React from "react";
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";

import Editor from "./component/editor/editor.js";
import NotificationList from "./component/editor/notificationlist.js";
import Player from "./component/player.js";
import NotificationCtx from "./context/notification.js";
import ProjectCtx from "./context/project.js";
import SaveCtx from "./context/save.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {});
    ProjectCtx.init(this);
    SaveCtx.init(this);
    NotificationCtx.init(this);
    this.registerExitHandler();
  }

  registerExitHandler() {
    this._registeredExitHandler = (e) => {
      if (this.state.projectCtx.needSave() || this.state.saveCtx.needSave) {
        e.preventDefault();
        const str = "You have unsaved changes. Exit anyway?";
        e.returnValue = str;
        return str;
      }
    };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this._registeredExitHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this._registeredExitHandler);
  }

  render() {
    return (
      <ProjectCtx.Provider stateRef={this}>
        <SaveCtx.Provider stateRef={this}>
          <NotificationCtx.Provider stateRef={this}>
            <NotificationList />
            <BrowserRouter basename="/app/story">
              <Switch>
                <Route component={Editor} path="/editor" />
                <Route component={Player} path="/player" />
                <Redirect from="/" to="/editor" />
              </Switch>
            </BrowserRouter>
          </NotificationCtx.Provider>
        </SaveCtx.Provider>
      </ProjectCtx.Provider>
    );
  }
}

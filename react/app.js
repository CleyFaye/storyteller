import React from "react";
import {BrowserRouter} from "react-router-dom";
import {Route} from "react-router-dom";
import {Redirect} from "react-router-dom";
import {Switch} from "react-router-dom";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Editor from "./component/editor/editor";
import Player from "./component/player";
import ProjectCtx from "./context/project";
import SaveCtx from "./context/save";
import NotificationList from "./component/editor/notificationlist";
import NotificationCtx from "./context/notification";

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
    this._registeredExitHandler = e => {
      if (this.state.projectCtx.needSave()
        || this.state.saveCtx.needSave) {
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
    return <React.Fragment>
      <ProjectCtx.Provider stateRef={this}>
        <SaveCtx.Provider stateRef={this}>
          <NotificationCtx.Provider stateRef={this}>
            <NotificationList />
            <BrowserRouter
              basename="/app/story">
              <Switch>
                <Route path="/editor" component={Editor} />
                <Route path="/player" component={Player} />
                <Redirect from="/" to="/editor" />
              </Switch>
            </BrowserRouter>
          </NotificationCtx.Provider>
        </SaveCtx.Provider>
      </ProjectCtx.Provider>
    </React.Fragment>;
  }
}

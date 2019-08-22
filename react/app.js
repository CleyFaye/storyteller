import React from "react";
import {BrowserRouter} from "react-router-dom";
import {Route} from "react-router-dom";
import {Redirect} from "react-router-dom";
import {Switch} from "react-router-dom";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Editor from "./component/editor/editor";
import ProjectCtx from "./context/project";
import SaveCtx from "./context/save";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {});
    ProjectCtx.init(this);
    SaveCtx.init(this);
    this.registerExitHandler();
  }

  registerExitHandler() {
    this._registeredExitHandler = e => {
      if (this.state.projectCtx.needSave()) {
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
          <BrowserRouter
            basename="/app">
            <Switch>
              <Route path="/editor" component={Editor} />
              <Route path="/player" component={null} />
              <Redirect from="/" to="/editor" />
            </Switch>
          </BrowserRouter>
        </SaveCtx.Provider>
      </ProjectCtx.Provider>
    </React.Fragment>;
  }
}
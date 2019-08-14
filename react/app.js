import React from "react";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Dashboard from "./component/layout/dashboard";
import ProjectCtx from "./context/project";
import {needSave} from "./service/project";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {});
    ProjectCtx.init(this);
    this._registeredExitHandler = e => {
      if (needSave(this.state.projectCtx)) {
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
        <Dashboard>
          <div>React real app</div>
        </Dashboard>
      </ProjectCtx.Provider>
    </React.Fragment>;
  }
}
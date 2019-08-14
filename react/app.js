import React from "react";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Dashboard from "./component/layout/dashboard";
import ProjectCtx from "./context/project";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {});
    ProjectCtx.init(this);
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
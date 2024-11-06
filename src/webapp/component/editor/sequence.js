import PropTypes from "prop-types";
import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import ProjectCtx from "../../context/project.js";

import Part from "./sequence/part.js";
import Parts from "./sequence/parts.js";

class Sequence extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
    };
  }

  componentDidMount = () => {
    if (!this.props.projectCtx.isOpen()) {
      this.setState({redirectTo: "/editor/welcome"});
    }
  };

  render = () => {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <Switch>
        <Route component={Parts} path="/editor/sequence/parts" />
        <Route component={Part} path="/editor/sequence/part/:partId" />
        <Redirect to="/editor/sequence/parts" />
      </Switch>
    );
  };
}
Sequence.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Sequence);

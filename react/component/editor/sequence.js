import React from "react";
import PropTypes from "prop-types";
import {Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {Redirect} from "react-router-dom";
import Parts from "./sequence/parts";
import ProjectCtx from "../../context/project";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";

class Sequence extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      redirectTo: null,
    });
  }

  componentDidMount() {
    if (!this.props.projectCtx.isOpen()) {
      this.updateState({redirectTo: "/editor/welcome"});
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <Switch>
      <Route path="/editor/sequence/parts" component={Parts} />
      <Redirect to="/editor/sequence/parts" />
    </Switch>;
  }
}
Sequence.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Sequence);
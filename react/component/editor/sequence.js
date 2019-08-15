import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import ProjectCtx from "../../context/project";
import {isOpen} from "../../service/project";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";

class Sequence extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      redirectTo: null,
    });
  }

  componentDidMount() {
    if (!isOpen(this.props.projectCtx)) {
      this.updateState({redirectTo: "/editor"});
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return "sequence editor";
  }
}
Sequence.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Sequence);
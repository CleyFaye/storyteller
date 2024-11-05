import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";
import ProjectCtx from "../../context/project";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";

class EditorWelcome extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      redirectTo: null,
    });
  }

  checkIsOpen() {
    if (this.props.projectCtx.isOpen()) {
      this.updateState({redirectTo: "/editor/sequence"});
    }
  }

  componentDidMount() {
    this.checkIsOpen();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.projectCtx.isOpen() != this.props.projectCtx.isOpen()) {
      this.checkIsOpen();
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <React.Fragment>
      <Typography variant="body1">
        To create or open a project, select the appropriate option from the menu
        on the left of the screen.
      </Typography>
    </React.Fragment>;
  }
}
EditorWelcome.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(EditorWelcome);
import {Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import {Redirect} from "react-router-dom";

import ProjectCtx from "../../context/project.js";

class EditorWelcome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
    };
  }

  checkIsOpen = () => {
    if (this.props.projectCtx.isOpen()) {
      this.setState({redirectTo: "/editor/sequence"});
    }
  };

  componentDidMount = () => {
    this.checkIsOpen();
  };

  componentDidUpdate = (oldProps) => {
    if (oldProps.projectCtx.isOpen() !== this.props.projectCtx.isOpen()) {
      this.checkIsOpen();
    }
  };

  render = () => {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <Typography variant="body1">
        To create or open a project, select the appropriate option from the menu on the left of the
        screen.
      </Typography>
    );
  };
}
EditorWelcome.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(EditorWelcome);

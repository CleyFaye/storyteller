import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import {isOpen} from "../../service/project";

class ProjectMenu extends React.Component {
  render() {
    if (!isOpen(this.props.projectCtx)) {
      return null;
    }
    return <div>Loaded project: {this.props.projectCtx.title}</div>;
  }
}
ProjectMenu.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(ProjectMenu);
import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import {isOpen} from "../../service/project";

/** Display the project title */
class Title extends React.Component {
  render() {
    if (this.props.prefix && isOpen(this.props.projectCtx)) {
      return `${this.props.prefix} - ${this.props.projectCtx.title}`;
    } else if (this.props.prefix) {
      return `${this.props.prefix}`;
    } else if (isOpen(this.props.projectCtx)) {
      return `${this.props.projectCtx.title}`;
    } else {
      return null;
    }
  }
}
Title.propTypes = {
  projectCtx: PropTypes.object,
  prefix: PropTypes.string,
};

export default ProjectCtx.withCtx(Title);
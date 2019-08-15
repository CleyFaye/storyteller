import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";

class Sequence extends React.Component {
  render() {
    return "sequence editor";
  }
}
Sequence.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Sequence);
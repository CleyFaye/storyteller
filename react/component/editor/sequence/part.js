import React from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import ProjectCtx from "../../../context/project";
import Chapter from "./part/chapter";

class Part extends React.Component {
  render() {
    const editorClasses = {
      "chapter": Chapter,
    };
    const partId = parseInt(this.props.match.params.partId);
    if (!this.props.projectCtx
      || !this.props.projectCtx.parts
      || partId >= this.props.projectCtx.parts.length) {
      return <Redirect to="/editor" />;
    }
    const EditorClass = editorClasses[this.props.projectCtx.parts[partId].type];
    return <EditorClass
      partId={partId} />;
  }
}
Part.propTypes = {
  projectCtx: PropTypes.object,
  match: PropTypes.object,
};

export default ProjectCtx.withCtx(Part);
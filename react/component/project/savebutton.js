import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import {IconButton} from "@material-ui/core";
import {Badge} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import {isOpen} from "../../service/project";
import {needSave} from "../../service/project";

/** Display the "save" button for the current project */
class SaveButton extends React.Component {
  handleSave() {
    if (!needSave(this.props.projectCtx)) {
      return;
    }
    console.log("Tried to save project");
  }

  render() {
    if (!isOpen(this.props.projectCtx)) {
      return null;
    }
    if (needSave(this.props.projectCtx)) {
      return <IconButton color="inherit" onClick={() => this.handleSave()}>
        <Badge color="secondary" variant="dot">
          <SaveIcon />
        </Badge>
      </IconButton>;
    }
    return <IconButton color="inherit">
      <SaveIcon />
    </IconButton>;
  }
}
SaveButton.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(SaveButton);
import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import SaveCtx from "../../context/save";
import NotificationCtx from "../../context/notification";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import SaveIcon from "@material-ui/icons/Save";
import {save as saveAction} from "../../service/action";

/** Display the "save" button for the current project */
class SaveButton extends React.Component {
  handleSave() {
    saveAction(
      this.props.projectCtx,
      this.props.saveCtx,
      this.props.notificationCtx);
  }

  render() {
    if (!this.props.projectCtx.isOpen()) {
      return null;
    }
    if (this.props.projectCtx.needSave()
      || this.props.saveCtx.needSave) {
      return <IconButton
        color="inherit"
        onClick={() => this.handleSave()}>
        <Badge color="secondary" variant="dot">
          <SaveIcon color={this.props.saveCtx.needSave ? "secondary" : undefined} />
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
  saveCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(
  NotificationCtx.withCtx(
    SaveCtx.withCtx(SaveButton)));
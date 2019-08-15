import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import NotificationCtx from "../../context/notification";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import SaveIcon from "@material-ui/icons/Save";
import {isOpen} from "../../service/project";
import {needSave} from "../../service/project";
import {saveProject} from "../../service/project";
import {notificationEnum} from "../../service/notification";
import {show as showNotification} from "../../service/notification";

/** Display the "save" button for the current project */
class SaveButton extends React.Component {
  handleSave() {
    saveProject(this.props.projectCtx)
      .then(() => showNotification(
        this.props.notificationCtx,
        notificationEnum.saveSuccess))
      .catch(() => showNotification(
        this.props.notificationCtx,
        notificationEnum.saveFailure));
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
  notificationCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(NotificationCtx.withCtx(SaveButton));
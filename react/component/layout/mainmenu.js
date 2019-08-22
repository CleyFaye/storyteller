import React from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import {buildMenuList} from "./util";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import ProjectCtx from "../../context/project";
import NotificationCtx from "../../context/notification";
import SaveCtx from "../../context/save";
import {dispatch as dispatchAction} from "../../service/action";

const mainEntries = [
  {
    icon: SettingsApplicationsIcon,
    label: "Application settings",
    path: "/editor/settings",
  },
];

class MainMenu extends React.Component {
  /** Run an action */
  runAction(actionName) {
    dispatchAction(
      actionName,
      this.props.projectCtx,
      this.props.saveCtx,
      this.props.notificationCtx);
  }

  render() {
    return <React.Fragment>
      <Divider />
      <List>
        {buildMenuList(mainEntries, action => this.runAction(action))}
      </List>
    </React.Fragment>;
  }
}
MainMenu.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
  saveCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(
  SaveCtx.withCtx(
    NotificationCtx.withCtx(
      MainMenu
    )
  )
);
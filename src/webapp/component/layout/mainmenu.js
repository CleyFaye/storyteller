import {Divider, List} from "@material-ui/core";

import {SettingsApplications as SettingsApplicationsIcon} from "@material-ui/icons";
import PropTypes from "prop-types";
import React from "react";

import NotificationCtx from "../../context/notification.js";
import ProjectCtx from "../../context/project.js";
import SaveCtx from "../../context/save.js";
import {dispatch as dispatchAction} from "../../service/action.js";

import {buildMenuList} from "./util.js";

const mainEntries = [
  {
    icon: SettingsApplicationsIcon,
    label: "Application settings",
    path: "/editor/settings",
  },
];

class MainMenu extends React.PureComponent {
  /** Run an action */
  runAction = (actionName) => {
    dispatchAction(
      actionName,
      this.props.projectCtx,
      this.props.saveCtx,
      this.props.notificationCtx,
    );
  };

  render = () => (
    <>
      <Divider />
      <List>{buildMenuList(mainEntries, (action) => this.runAction(action))}</List>
    </>
  );
}
MainMenu.propTypes = {
  notificationCtx: PropTypes.object,
  projectCtx: PropTypes.object,
  saveCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(SaveCtx.withCtx(NotificationCtx.withCtx(MainMenu)));

import {Divider, List} from "@material-ui/core";
import {
  OpenInBrowser as OpenInBrowserIcon,
  Create as CreateIcon,
  Save as SaveIcon,
  Dashboard as DashboardIcon,
  PlayCircleOutline,
  ImportExport as ImportExportIcon,
} from "@material-ui/icons";
import PropTypes from "prop-types";
import React from "react";

import NotificationCtx from "../../context/notification.js";
import ProjectCtx from "../../context/project.js";
import SaveCtx from "../../context/save.js";

import {dispatch as dispatchAction} from "../../service/action.js";

import {buildMenuList} from "./util.js";

const newProjectEntry = {
  icon: CreateIcon,
  label: "New",
  path: "/editor/new",
};

const loadProjectEntry = {
  icon: OpenInBrowserIcon,
  label: "Open…",
  path: "/editor/load",
};

const importProjectEntry = {
  icon: ImportExportIcon,
  label: "Import / export",
  path: "/editor/filemanager",
};

/** List of options when no project are open */
const noProjectEntries = [newProjectEntry, loadProjectEntry, importProjectEntry];

const openProjectEntries = [
  {
    icon: DashboardIcon,
    label: "Sequence editor",
    path: "/editor/sequence",
  },
  "divider",
  newProjectEntry,
  loadProjectEntry,
  importProjectEntry,
  {
    action: "save",
    icon: SaveIcon,
    label: "Save",
  },
  {
    icon: PlayCircleOutline,
    label: "Start player",
    path: "/player",
  },
];

class ProjectMenu extends React.PureComponent {
  renderMenu = () => {
    if (!this.props.projectCtx.isOpen()) {
      return buildMenuList(noProjectEntries, (action) => this.runAction(action));
    }
    return buildMenuList(openProjectEntries, (action) => this.runAction(action));
  };

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
      <List>{this.renderMenu()}</List>
    </>
  );
}
ProjectMenu.propTypes = {
  notificationCtx: PropTypes.object,
  projectCtx: PropTypes.object,
  saveCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(SaveCtx.withCtx(NotificationCtx.withCtx(ProjectMenu)));

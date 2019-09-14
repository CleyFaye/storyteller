import React from "react";
import PropTypes from "prop-types";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ProjectCtx from "../../context/project";
import NotificationCtx from "../../context/notification";
import SaveCtx from "../../context/save";
import {buildMenuList} from "./util";
import {dispatch as dispatchAction} from "../../service/action";

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
const noProjectEntries = [
  newProjectEntry,
  loadProjectEntry,
  importProjectEntry,
];

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
    icon: SaveIcon,
    label: "Save",
    action: "save",
  },
  {
    icon: PlayCircleOutline,
    label: "Start player",
    path: "/player",
  }
];

class ProjectMenu extends React.Component {
  renderMenu() {
    if (!this.props.projectCtx.isOpen()) {
      return buildMenuList(noProjectEntries, action => this.runAction(action));
    }
    return buildMenuList(openProjectEntries, action => this.runAction(action));
  }

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
        {this.renderMenu()}
      </List>
    </React.Fragment>;
  }
}
ProjectMenu.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
  saveCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(
  SaveCtx.withCtx(
    NotificationCtx.withCtx(ProjectMenu)));
import React from "react";
import PropTypes from "prop-types";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ProjectCtx from "../../context/project";
import {isOpen} from "../../service/project";
import {buildMenuList} from "./util";

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

/** List of options when no project are open */
const noProjectEntries = [
  newProjectEntry,
  loadProjectEntry,
];

const openProjectEntries = [
  {
    icon: SettingsIcon,
    label: "Project settings",
    path: "/editor/projectSettings",
  },
  {
    icon: DashboardIcon,
    label: "Sequence editor",
    path: "/editor/sequence",
  },
  "divider",
  newProjectEntry,
  loadProjectEntry,
  {
    icon: SaveIcon,
    label: "Save…",
    action: "save",
  }
];

class ProjectMenu extends React.Component {
  renderMenu() {
    if (!isOpen(this.props.projectCtx)) {
      return buildMenuList(noProjectEntries);
    }
    return buildMenuList(openProjectEntries);
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
};

export default ProjectCtx.withCtx(ProjectMenu);
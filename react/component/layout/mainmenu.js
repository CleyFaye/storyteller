import React from "react";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import DashboardIcon from "@material-ui/icons/Dashboard";
import {buildMenuList} from "./util";

const menuEntries = [
  {
    icon: DashboardIcon,
    label: "Overview",
    path: "/editor/overview",
  }
];

export default class MainMenu extends React.Component {
  render() {
    return <React.Fragment>
      <Divider />
      <List>
        {buildMenuList(menuEntries)}
      </List>
    </React.Fragment>;
  }
}
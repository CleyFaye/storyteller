import React from "react";
import {ListItem, ListItemText} from "@material-ui/core";
import {ListItemIcon} from "@material-ui/core";

export const buildMenuList = menuEntries =>
  menuEntries.map(entry => <ListItem button key={entry.path}>
    <ListItemIcon>
      <entry.icon />
    </ListItemIcon>
    <ListItemText primary={entry.label} />
  </ListItem>);
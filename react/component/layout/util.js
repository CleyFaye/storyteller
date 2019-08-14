import React from "react";
import {ListItem, ListItemText, Divider} from "@material-ui/core";
import {ListItemIcon} from "@material-ui/core";

export const buildMenuList = menuEntries => {
  let dividerId = 0;
  return menuEntries.map(entry => entry == "divider"
    ? <Divider key={`divider${++dividerId}`} />
    : <ListItem button key={entry.path || entry.action}>
      <ListItemIcon>
        <entry.icon />
      </ListItemIcon>
      <ListItemText primary={entry.label} />
    </ListItem>);
};
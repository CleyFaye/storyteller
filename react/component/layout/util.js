import React from "react";
import {NavLink} from "react-router-dom";
import {ListItem, ListItemText, Divider} from "@material-ui/core";
import {ListItemIcon} from "@material-ui/core";

// eslint-disable-next-line react/display-name
const UILink = React.forwardRef(
  (props, ref) => <NavLink innerRef={ref} {...props} />
);

const renderMenuEntryContent = entry => <React.Fragment>
  <ListItemIcon>
    <entry.icon />
  </ListItemIcon>
  <ListItemText primary={entry.label} />
</React.Fragment>;

const handleMenuEntry = (entry, actionHandler) => {
  if (entry.path) {
    return <ListItem
      button
      key={entry.path}
      component={UILink}
      to={entry.path}
      activeStyle={{backgroundColor: "lightgray"}}>
      {renderMenuEntryContent(entry)}
    </ListItem>;
  } else if (entry.action) {
    return <ListItem
      button
      onClick={() => actionHandler(entry.action)}
      key={entry.action}>
      {renderMenuEntryContent(entry)}
    </ListItem>;
  }
};

export const buildMenuList = (menuEntries, actionHandler) => {
  let dividerId = 0;
  return menuEntries.map(entry => entry == "divider"
    ? <Divider key={`divider${++dividerId}`} />
    : handleMenuEntry(entry, actionHandler));
};
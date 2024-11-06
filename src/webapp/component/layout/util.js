import {ListItem, ListItemText, Divider, ListItemIcon} from "@material-ui/core";
import React from "react";
import {NavLink} from "react-router-dom";

// eslint-disable-next-line react/display-name
const UILink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);

const renderMenuEntryContent = (entry) => (
  <>
    <ListItemIcon>
      <entry.icon />
    </ListItemIcon>
    <ListItemText primary={entry.label} />
  </>
);

const handleMenuEntry = (entry, actionHandler) => {
  if (entry.path) {
    return (
      <ListItem
        activeStyle={{backgroundColor: "lightgray"}}
        button
        component={UILink}
        key={entry.path}
        to={entry.path}
      >
        {renderMenuEntryContent(entry)}
      </ListItem>
    );
  } else if (entry.action) {
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <ListItem button key={entry.action} onClick={() => actionHandler(entry.action)}>
        {renderMenuEntryContent(entry)}
      </ListItem>
    );
  }
};

export const buildMenuList = (menuEntries, actionHandler) => {
  let dividerId = 0;
  return menuEntries.map((entry) =>
    entry === "divider" ? (
      <Divider key={`divider${++dividerId}`} />
    ) : (
      handleMenuEntry(entry, actionHandler)
    ),
  );
};

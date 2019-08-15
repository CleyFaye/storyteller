import React from "react";
import Dashboard from "../layout/dashboard";
import NotificationList from "./notificationlist";
import NotificationCtx from "../../context/notification";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    NotificationCtx.init(this);
  }

  render() {
    return <NotificationCtx.Provider stateRef={this}>
      <NotificationList />
      <Dashboard />
    </NotificationCtx.Provider>;
  }
}

export default Editor;
import {Snackbar} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

import NotificationCtx from "../../context/notification.js";
import {notificationEnum} from "../../service/notification.js";

class NotificationList extends React.Component {
  /** Build a single notification object */
  buildNotification(key) {
    const {label} = notificationEnum[key];
    return (
      <Snackbar
        autoHideDuration={6000}
        key={key}
        message={label}
        onClose={() => this.props.notificationCtx.update({[key]: false})}
        open={this.props.notificationCtx[key]}
      />
    );
  }

  render() {
    return Object.keys(notificationEnum).map((key) => this.buildNotification(key));
  }
}
NotificationList.propTypes = {
  notificationCtx: PropTypes.object,
};

export default NotificationCtx.withCtx(NotificationList);

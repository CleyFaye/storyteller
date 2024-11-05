import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import NotificationCtx from "../../context/notification";
import {notificationEnum} from "../../service/notification";

class NotificationList extends React.Component {
  /** Build a single notification object */
  buildNotification(key) {
    const {label} = notificationEnum[key];
    return <Snackbar
      key={key}
      open={this.props.notificationCtx[key]}
      autoHideDuration={6000}
      onClose={() => this.props.notificationCtx.update({[key]: false})}
      message={label} />;
  }

  render() {
    return Object.keys(notificationEnum).map(
      key => this.buildNotification(key));
  }
}
NotificationList.propTypes = {
  notificationCtx: PropTypes.object,
};

export default NotificationCtx.withCtx(NotificationList);
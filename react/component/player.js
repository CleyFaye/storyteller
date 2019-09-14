import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import ProjectCtx from "../context/project";
import NotificationCtx from "../context/notification";
import {notificationEnum} from "../service/notification";
import Basic from "./player/basic";

/** Display the story player */
class Player extends React.Component {
  componentDidMount() {
    if (this.props.projectCtx.needSave()) {
      this.props.notificationCtx.show(notificationEnum.saveBeforePlay);
    }
  }

  render() {
    if (this.props.projectCtx.needSave()
      || !this.props.projectCtx.isOpen()) {
      return <Redirect to="/editor/welcome" />;
    }
    return <Basic />;
  }
}
Player.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(
  NotificationCtx.withCtx(
    Player
  )
);
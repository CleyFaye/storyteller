import PropTypes from "prop-types";
import React from "react";
import {Redirect} from "react-router-dom";

import NotificationCtx from "../context/notification.js";
import ProjectCtx from "../context/project.js";
import {notificationEnum} from "../service/notification.js";

import Basic from "./player/basic.js";

/** Display the story player */
class Player extends React.PureComponent {
  componentDidMount = () => {
    if (this.props.projectCtx.needSave()) {
      this.props.notificationCtx.show(notificationEnum.saveBeforePlay);
    }
  };

  render = () => {
    if (this.props.projectCtx.needSave() || !this.props.projectCtx.isOpen()) {
      return <Redirect to="/editor/welcome" />;
    }
    return <Basic />;
  };
}
Player.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(NotificationCtx.withCtx(Player));

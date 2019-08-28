import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import ProjectCtx from "../context/project";
import NotificationCtx from "../context/notification";
import {notificationEnum} from "../service/notification";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";

/** Display the story player */
class Player extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      redirect: null,
    });
  }

  componentDidMount() {
    if (this.props.projectCtx.needSave()) {
      this.props.notificationCtx.show(notificationEnum.saveBeforePlay);
      this.updateState({redirect: "/editor"});
    } else if (!this.props.projectCtx.isOpen()) {
      this.updateState({redirect: "/editor"});
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return <div>Player</div>;
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
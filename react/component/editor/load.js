import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import {Redirect} from "react-router-dom";
import NotificationCtx from "../../context/notification";
import {loadProject} from "../../service/project";
import {needSave} from "../../service/project";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {listExisting} from "../../service/project";
import {notificationEnum} from "../../service/notification";
import {show as showNotification} from "../../service/notification";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

class Load extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      availableProjects: null,
      showWarning: false,
      loadItem: null,
      redirectTo: null,
    });
  }
  componentDidMount() {
    listExisting()
      .then(availableProjects => this.updateState({
        availableProjects
      }))
      .catch(() => showNotification(
        this.props.notificationCtx,
        notificationEnum.networkReadError));
  }

  /** User clicked on a project to load it */
  handleLoad(projectName) {
    this.updateState({loadItem: projectName})
      .then(() => {
        if (needSave(this.props.projectCtx)) {
          this.updateState({showWarning: true});
        } else {
          this.handleLoadConfirm();
        }
      });
  }

  /** User confirmed loading */
  handleLoadConfirm() {
    this.updateState({showWarning: false})
      .then(() => loadProject(this.props.projectCtx, this.state.loadItem))
      .then(() => showNotification(
        this.props.notificationCtx,
        notificationEnum.loadSuccess))
      .then(() => this.updateState({redirectTo: "/editor/sequence"}))
      .catch(
        () => this.updateState({loadItem: null})
          .then(() => showNotification(
            this.props.notificationCtx,
            notificationEnum.loadFailure))
      );
  }

  renderConfirmErase() {
    return <Dialog 
      open={this.state.showWarning}
      onClose={() => this.updateState({
        showWarning: false,
      })}>
      <DialogTitle>Load project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Current project have unsaved changes. If you proceed you will lose
          these changes. Do you want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => this.updateState({
            showWarning: false,
            loadItem: null,
          })}>
            Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleLoadConfirm()}>
            Continue
        </Button>
      </DialogActions>
    </Dialog>;
  }


  renderItems() {
    return this.state.availableProjects.map(
      projectName => <ListItem
        button
        key={projectName}
        onClick={() => this.handleLoad(projectName)}>
        <ListItemText primary={projectName} />
      </ListItem>);
  }

  renderRedirect() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return null;
  }

  render() {
    if (this.state.availableProjects === null) {
      return <Typography variant="body1">
        Please wait while we load the projects list…
      </Typography>;
    }
    if (this.state.availableProjects.length == 0) {
      return <Typography variant="body1">
        There is no project saved on the server.
      </Typography>;
    }
    return <React.Fragment>
      {this.renderConfirmErase()}
      {this.renderRedirect()}
      <Typography variant="h4">
        Select the project to load:
      </Typography>
      <List>
        {this.renderItems()}
      </List>
    </React.Fragment>;
  }
}
Load.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(NotificationCtx.withCtx(Load));
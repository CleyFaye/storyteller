import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import {Redirect} from "react-router-dom";

import NotificationCtx from "../../context/notification.js";
import ProjectCtx from "../../context/project.js";

import {notificationEnum} from "../../service/notification.js";
import {listExisting} from "../../service/project.js";

class Load extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      availableProjects: null,
      loadItem: null,
      redirectTo: null,
      showWarning: false,
    };
  }

  componentDidMount = () => {
    (async () => {
      const availableProjects = await listExisting();
      this.setState({availableProjects});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => this.props.notificationCtx.show(notificationEnum.networkReadError));
  };

  componentDidUpdate = (oldProps, oldState) => {
    if (oldState.loadItem !== this.state.loadItem && this.state.loadItem) {
      if (this.props.projectCtx.needSave()) {
        this.setState({showWarning: true});
      } else {
        this.handleLoadConfirm();
      }
    }
  };

  /** User clicked on a project to load it */
  handleLoad = (projectName) => {
    this.setState({loadItem: projectName});
  };

  /** User confirmed loading */
  handleLoadConfirm = () => {
    this.setState({showWarning: false});
    (async () => {
      await this.props.projectCtx.loadProject(this.state.loadItem);
      this.props.notificationCtx.show(notificationEnum.loadSuccess);
      this.setState({redirectTo: "/editor/sequence"});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {
      this.setState({loadItem: null});
      this.props.notificationCtx.show(notificationEnum.loadFailure);
    });
  };

  handleCloseWarning = () => {
    this.setState({showWarning: false});
  };

  handleCancel = () =>
    this.setState({
      showWarning: false,
      loadItem: null,
    });

  renderConfirmErase = () => (
    <Dialog onClose={this.handleCloseWarning} open={this.state.showWarning}>
      <DialogTitle>Load project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Current project have unsaved changes. If you proceed you will lose these changes. Do you
          want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleCancel}>
          Cancel
        </Button>
        <Button color="primary" onClick={this.handleLoadConfirm} variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );

  renderItems = () =>
    this.state.availableProjects.map((projectName) => (
      // eslint-disable-next-line react/jsx-no-bind
      <ListItem button key={projectName} onClick={() => this.handleLoad(projectName)}>
        <ListItemText primary={projectName} />
      </ListItem>
    ));

  renderRedirect = () => {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return null;
  };

  render = () => {
    if (this.state.availableProjects === null) {
      return <Typography variant="body1">Please wait while we load the projects list…</Typography>;
    }
    if (this.state.availableProjects.length === 0) {
      return <Typography variant="body1">There is no project saved on the server.</Typography>;
    }
    return (
      <>
        {this.renderConfirmErase()}
        {this.renderRedirect()}
        <Typography variant="h4">Select the project to load:</Typography>
        <List>{this.renderItems()}</List>
      </>
    );
  };
}
Load.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(NotificationCtx.withCtx(Load));

import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import form from "@cley_faye/react-utils/lib/mixin/form.js";
import {notEmpty} from "@cley_faye/react-utils/lib/validator/string.js";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import {Redirect} from "react-router-dom";

import ProjectCtx from "../../context/project.js";
import {listExisting} from "../../service/project.js";

const steps = {
  CONFIRM_ERASE: Symbol("CONFIRM_ERASE"),
  CONFIRM_NEW: Symbol("CONFIRM_NEW"),
  END: Symbol("END"),
  NEW_FORM: Symbol("NEW_FORM"),
};

class EditorNew extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: steps.NEW_FORM,
      title: "unnamed project",
    };
    this.validateForm = form(this, {
      title: notEmpty("Title can't be empty"),
    });
    this.handleChange = changeHandlerMixin(this);
  }

  /** User clicked on the "New project" button */
  handleNew = () => {
    (async () => {
      const formValid = await this.validateForm();
      if (!formValid) return;
      if (this.props.projectCtx.needSave()) {
        this.setState({step: steps.CONFIRM_NEW});
      } else {
        this.handleConfirmNew();
      }
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  /** Either there is no need to save or the user confirmed he didn't want to
   * save.
   */
  handleConfirmNew = () => {
    (async () => {
      const existingProjects = await listExisting();
      if (existingProjects.includes(this.state.title)) {
        this.setState({step: steps.CONFIRM_ERASE});
      } else {
        this.handleConfirmErase();
      }
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  /** Either the project is a new one, or the user confirmed erasing the old one
   */
  handleConfirmErase = () => {
    (async () => {
      await this.props.projectCtx.newProject({title: this.state.title});
      this.setState({step: steps.END});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  handleDialogClose = () => this.setState({step: steps.END});

  renderNewForm = () => (
    <Dialog onClose={this.handleDialogClose} open={this.state.step === steps.NEW_FORM}>
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <DialogContentText>To create a new project you have to give it a title.</DialogContentText>
        <TextField
          autoFocus
          error={this.state.titleError !== null}
          fullWidth
          helperText={this.state.titleError}
          label="Title"
          name="title"
          onChange={this.handleChange}
          value={this.state.title}
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleDialogClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={this.handleNew} variant="contained">
          New project
        </Button>
      </DialogActions>
    </Dialog>
  );

  handleBackToNew = () => this.setState({step: steps.NEW_FORM});

  renderConfirmNew = () => (
    <Dialog onClose={this.handleBackToNew} open={this.state.step === steps.CONFIRM_NEW}>
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The current project have unsaved changes that will be lost. Proceed anyway?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleBackToNew}>
          Cancel
        </Button>
        <Button color="primary" onClick={this.handleConfirmNew} variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );

  renderConfirmErase = () => (
    <Dialog onClose={this.handleBackToNew} open={this.state.step === steps.CONFIRM_ERASE}>
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A project with this title already exist. If you proceed and save, you will erase the
          existing project. Do you want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleBackToNew}>
          Cancel
        </Button>
        <Button color="primary" onClick={this.handleConfirmErase} variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );

  renderEndRedirect = () =>
    this.state.step === steps.END ? <Redirect to="/editor/welcome" /> : null;

  render = () => (
    <>
      {this.renderNewForm()}
      {this.renderConfirmNew()}
      {this.renderConfirmErase()}
      {this.renderEndRedirect()}
    </>
  );
}
EditorNew.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(EditorNew);

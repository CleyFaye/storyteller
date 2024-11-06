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
  NEW_FORM: Symbol("NEW_FORM"),
  CONFIRM_NEW: Symbol("CONFIRM_NEW"),
  CONFIRM_ERASE: Symbol("CONFIRM_ERASE"),
  END: Symbol("END"),
};

class EditorNew extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      step: steps.NEW_FORM,
      title: "unnamed project",
    });
    this.validateForm = form(this, {
      title: notEmpty("Title can't be empty"),
    });
    this.handleChange = changeHandlerMixin(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this.validateUpdate(prevState);
  }

  /** User clicked on the "New project" button */
  handleNew() {
    this.validateForm().then((formValid) => {
      if (!formValid) {
        return;
      }
      if (this.props.projectCtx.needSave()) {
        this.setState({step: steps.CONFIRM_NEW});
      } else {
        this.handleConfirmNew();
      }
    });
  }

  /** Either there is no need to save or the user confirmed he didn't want to
   * save.
   */
  handleConfirmNew() {
    listExisting().then((existingProjects) => {
      if (existingProjects.includes(this.state.title)) {
        this.setState({step: steps.CONFIRM_ERASE});
      } else {
        this.handleConfirmErase();
      }
    });
  }

  /** Either the project is a new one, or the user confirmed erasing the old one
   */
  handleConfirmErase() {
    this.props.projectCtx
      .newProject({
        title: this.state.title,
      })
      .then(() => this.setState({step: steps.END}));
  }

  renderNewForm() {
    return (
      <Dialog
        onClose={() => this.setState({step: steps.END})}
        open={this.state.step == steps.NEW_FORM}
      >
        <DialogTitle>Create new project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new project you have to give it a title.
          </DialogContentText>
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
          <Button color="primary" onClick={() => this.setState({step: steps.END})}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.handleNew()} variant="contained">
            New project
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderConfirmNew() {
    return (
      <Dialog
        onClose={() => this.setState({step: steps.NEW_FORM})}
        open={this.state.step == steps.CONFIRM_NEW}
      >
        <DialogTitle>Create new project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The current project have unsaved changes that will be lost. Proceed anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.setState({step: steps.NEW_FORM})}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.handleConfirmNew()} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderConfirmErase() {
    return (
      <Dialog
        onClose={() => this.setState({step: steps.NEW_FORM})}
        open={this.state.step == steps.CONFIRM_ERASE}
      >
        <DialogTitle>Create new project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A project with this title already exist. If you proceed and save, you will erase the
            existing project. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.setState({step: steps.NEW_FORM})}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.handleConfirmErase()} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderEndRedirect() {
    return this.state.step == steps.END ? <Redirect to="/editor/welcome" /> : null;
  }

  render() {
    return (
      <>
        {this.renderNewForm()}
        {this.renderConfirmNew()}
        {this.renderConfirmErase()}
        {this.renderEndRedirect()}
      </>
    );
  }
}
EditorNew.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(EditorNew);

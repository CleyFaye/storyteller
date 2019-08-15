import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import form from "@cley_faye/react-utils/lib/mixin/form";
import {notEmpty} from "@cley_faye/react-utils/lib/validator/string";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ProjectCtx from "../../context/project";
import {needSave} from "../../service/project";
import {newProject} from "../../service/project";
import {listExisting} from "../../service/project";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


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
    form(this, {
      title: notEmpty("Title can't be empty"),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.validateUpdate(prevState);
  }

  /** User clicked on the "New project" button */
  handleNew() {
    this.validateForm()
      .then(formValid => {
        if (!formValid) {
          return;
        }
        if (needSave(this.props.projectCtx)) {
          this.updateState({step: steps.CONFIRM_NEW});
        } else {
          this.handleConfirmNew();
        }
      });
  }

  /** Either there is no need to save or the user confirmed he didn't want to
   * save.
   */
  handleConfirmNew() {
    listExisting().then(
      existingProjects => {
        if (existingProjects.includes(this.state.title)) {
          this.updateState({step: steps.CONFIRM_ERASE});
        } else {
          this.handleConfirmErase();
        }
      }
    );
  }

  /** Either the project is a new one, or the user confirmed erasing the old one
   */
  handleConfirmErase() {
    newProject(this.props.projectCtx, {
      title: this.state.title,
    }).then(() => this.updateState({step: steps.END}));
  }

  renderNewForm() {
    return <Dialog 
      open={this.state.step == steps.NEW_FORM}
      onClose={() => this.updateState({step: steps.END})}>
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <DialogContentText>
            To create a new project you have to give it a title.
        </DialogContentText>
        <TextField
          autoFocus
          variant="filled"
          label="Title"
          error={this.state.titleError !== null}
          helperText={this.state.titleError}
          value={this.state.title}
          onChange={this.changeHandler("title")}
          fullWidth />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => this.updateState({step: steps.END})}>
            Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleNew()}>
            New project
        </Button>
      </DialogActions>
    </Dialog>;
  }

  renderConfirmNew() {
    return <Dialog 
      open={this.state.step == steps.CONFIRM_NEW}
      onClose={() => this.updateState({step: steps.NEW_FORM})}>
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The current project have unsaved changes that will be lost.
          Proceed anyway?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => this.updateState({step: steps.NEW_FORM})}>
            Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleConfirmNew()}>
            Continue
        </Button>
      </DialogActions>
    </Dialog>;
  }

  renderConfirmErase() {
    return <Dialog 
      open={this.state.step == steps.CONFIRM_ERASE}
      onClose={() => this.updateState({step: steps.NEW_FORM})}>
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A project with this title already exist. If you proceed and save, you
          will erase the existing project. Do you want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => this.updateState({step: steps.NEW_FORM})}>
            Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleConfirmErase()}>
            Continue
        </Button>
      </DialogActions>
    </Dialog>;
  }

  renderEndRedirect() {
    return this.state.step == steps.END
      ? <Redirect to="/editor" />
      : null;
  }

  render() {
    return <React.Fragment>
      {this.renderNewForm()}
      {this.renderConfirmNew()}
      {this.renderConfirmErase()}
      {this.renderEndRedirect()}
    </React.Fragment>;
  }
}
EditorNew.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(EditorNew);
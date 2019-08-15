import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import cb from "@cley_faye/react-utils/lib/mixin/cb";
import form from "@cley_faye/react-utils/lib/mixin/form";
import {notEmpty} from "@cley_faye/react-utils/lib/validator/string";

class AddPart extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      partType: "chapter",
      partTitle: "",
    });
    cb(this);
    form(this, {
      partTitle: notEmpty("Part title can't be empty"),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open && !prevProps.open) {
      this.resetValidation();
    } else {
      this.validateUpdate(prevState);
    }
  }

  handleAdd() {
    this.validateForm()
      .then(formValid => {
        if (!formValid) {
          return;
        }
        this.cb(this.props.onAdd, {
          type: this.state.partType,
          title: this.state.partTitle,
        });
      });
  }

  handleClose() {
    this.resetState();
    this.cb(this.props.onClose);
  }

  render() {
    return <Dialog 
      open={this.props.open}
      onClose={() => this.handleClose()}>
      <DialogTitle>Add part</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a new part to this project.
        </DialogContentText>
        <TextField
          autoFocus
          variant="filled"
          label="Title"
          error={this.state.partTitleError !== null}
          helperText={this.state.partTitleError}
          value={this.state.partTitle}
          onChange={this.changeHandler("partTitle")}
          fullWidth />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => this.handleClose()}>
            Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleAdd()}>
            Add part
        </Button>
      </DialogActions>
    </Dialog>;

  }
}
AddPart.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
};

export default AddPart;
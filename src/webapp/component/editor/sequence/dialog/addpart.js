import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler";
import form, {resetValidation} from "@cley_faye/react-utils/lib/mixin/form.js";
import {notEmpty} from "@cley_faye/react-utils/lib/validator/string.js";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

class AddPart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultState = {partType: "chapter", partTitle: ""};
    this.state = {...this.defaultState};
    this.validateForm = form(this, {
      partTitle: notEmpty("Part title can't be empty"),
    });
    this.handleChange = changeHandlerMixin(this);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.open && !prevProps.open) {
      resetValidation(this);
    }
  };

  handleAdd = () => {
    (async () => {
      const formValid = await this.validateForm();
      if (!formValid) return;
      this.props.onAdd?.({
        type: this.state.partType,
        title: this.state.partTitle,
      });
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  handleClose = () => {
    this.setState({...this.defaultState});
    this.props.onClose?.();
  };

  render = () => (
    <Dialog onClose={this.handleClose} open={this.props.open}>
      <DialogTitle>Add part</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a new part to this project.</DialogContentText>
        <TextField
          autoFocus
          error={this.state.partTitleError !== null}
          fullWidth
          helperText={this.state.partTitleError}
          label="Title"
          name="partTitle"
          onChange={this.handleChange}
          value={this.state.partTitle}
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={this.handleAdd} variant="contained">
          Add part
        </Button>
      </DialogActions>
    </Dialog>
  );
}
AddPart.propTypes = {
  onAdd: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default AddPart;

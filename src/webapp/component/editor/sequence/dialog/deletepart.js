import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

class DeletePart extends React.PureComponent {
  handleCancel = () => {
    this.props.onClose?.();
  };

  handleDelete = () => {
    this.props.onDelete?.();
  };

  render = () => (
    <Dialog open={this.props.open}>
      <DialogTitle>Confirm part deletion</DialogTitle>
      <DialogContent dividers>
        Do you really want to delete part {this.props.partTitle}?
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleCancel}>
          Cancel
        </Button>
        <Button color="primary" onClick={this.handleDelete}>
          Delete part
        </Button>
      </DialogActions>
    </Dialog>
  );
}
DeletePart.propTypes = {
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  partTitle: PropTypes.string,
};

export default DeletePart;

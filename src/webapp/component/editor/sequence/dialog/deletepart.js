import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import cbCall from "@cley_faye/react-utils/lib/mixin/cb";

class DeletePart extends React.Component {
  constructor(props) {
    super(props);
    cbCall(this);
  }

  handleCancel() {
    this.cb(this.props.onClose);
  }

  handleDelete() {
    this.cb(this.props.onDelete);
  }

  render() {
    return <Dialog
      open={this.props.open}>
      <DialogTitle>Confirm part deletion</DialogTitle>
      <DialogContent dividers>
        Do you really want to delete part {this.props.partTitle}?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => this.handleCancel()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => this.handleDelete()} color="primary">
          Delete part
        </Button>
      </DialogActions>
    </Dialog>;
  }
}
DeletePart.propTypes = {
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  partTitle: PropTypes.string,
  open: PropTypes.bool,
};

export default DeletePart;
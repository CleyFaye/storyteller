import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import PropTypes from "prop-types";
import React from "react";
import {Redirect} from "react-router-dom";

import ProjectCtx from "../../../context/project.js";

import AddPart from "./dialog/addpart.js";
import DeletePart from "./dialog/deletepart.js";

/** Display all parts */
class Parts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addDialog: false,
      deleteConfirm: null,
      redirectTo: null,
    };
  }

  handleAddPart = (partDef) => {
    this.setState({addDialog: false});
    this.props.projectCtx.addPart(partDef);
  };

  handleClose = () => {
    this.setState({addDialog: false});
  };

  renderAddDialog = () => (
    <AddPart onAdd={this.handleAddPart} onClose={this.handleClose} open={this.state.addDialog} />
  );

  handleAdd = () => {
    this.setState({addDialog: true});
  };

  renderAddPartButton = () => (
    <Button color="primary" onClick={this.handleAdd} variant="contained">
      Add part
    </Button>
  );

  renderMoveUpButton = (id) => (
    // eslint-disable-next-line react/jsx-no-bind
    <IconButton disabled={id <= 0} onClick={() => this.props.projectCtx.movePart(id, id - 1)}>
      <ArrowUpwardIcon />
    </IconButton>
  );

  renderMoveDownButton = (id) => (
    <IconButton
      disabled={id >= this.props.projectCtx.parts.length - 1}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => this.props.projectCtx.movePart(id, id + 1)}
    >
      <ArrowDownwardIcon />
    </IconButton>
  );

  handleDeletePart = (id) => {
    this.setState({deleteConfirm: id});
  };

  renderDeleteButton = (id) => (
    // eslint-disable-next-line react/jsx-no-bind
    <IconButton onClick={() => this.handleDeletePart(id)}>
      <DeleteIcon />
    </IconButton>
  );

  openPart = (partId) => {
    this.setState({
      redirectTo: `/editor/sequence/part/${partId}`,
    });
  };

  renderPartItem = (part, id) => {
    if (part.type === "chapter") {
      return (
        // eslint-disable-next-line react/jsx-no-bind
        <ListItem button key={id} onClick={() => this.openPart(id)}>
          <ListItemText primary={this.props.projectCtx.getPartTitle(id)} />
          <ListItemSecondaryAction>
            {this.renderMoveUpButton(id)}
            {this.renderMoveDownButton(id)}
            {this.renderDeleteButton(id)}
          </ListItemSecondaryAction>
        </ListItem>
      );
    }
    throw new Error(`Unknown part type: "${part.type}"`);
  };

  renderPartsItem = () =>
    this.props.projectCtx.parts.map((part, id) => this.renderPartItem(part, id));

  renderPartsList = () => {
    if (this.props.projectCtx.parts.length === 0) {
      return (
        <>
          <Typography variant="h5">This project currently have no parts.</Typography>
          {this.renderAddPartButton()}
        </>
      );
    }
    return (
      <>
        <Typography variant="h5">Available parts in this project:</Typography>
        <List>{this.renderPartsItem()}</List>
        {this.renderAddPartButton()}
      </>
    );
  };

  static renderPartEditor = () => null;

  handleDeleteClose = () => {
    this.setState({
      deleteConfirm: null,
    });
  };

  handleDeleteConfirm = () => {
    const partToDelete = this.state.deleteConfirm;
    this.setState({deleteConfirm: null});
    this.props.projectCtx.deletePart(partToDelete);
  };

  renderDeleteDialog = () => (
    <DeletePart
      onClose={this.handleDeleteClose}
      onDelete={this.handleDeleteConfirm}
      open={this.state.deleteConfirm !== null}
      partTitle={
        this.state.deleteConfirm === null
          ? null
          : this.props.projectCtx.getPartTitle(this.state.deleteConfirm)
      }
    />
  );

  render = () => {
    if (!this.props.projectCtx.isOpen()) {
      return <Typography variant="body1">Loading…</Typography>;
    }
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <>
        {this.renderDeleteDialog()}
        {this.renderAddDialog()}
        {this.renderPartsList()}
        {Parts.renderPartEditor()}
      </>
    );
  };
}
Parts.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Parts);

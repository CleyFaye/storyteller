import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import ProjectCtx from "../../../context/project";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AddPart from "./dialog/addpart";

/** Display all parts */
class Parts extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      addDialog: false,
      redirectTo: null,
    });
  }

  handleOpenAddDialog() {
    this.updateState({
      addDialog: true,
    });
  }

  handleAddPart(partDef) {
    this.updateState({
      addDialog: false,
    }).then(() => this.props.projectCtx.addPart(partDef));
  }

  renderAddDialog() {
    return <AddPart
      open={this.state.addDialog}
      onClose={() => this.updateState({addDialog: false})}
      onAdd={partDef => this.handleAddPart(partDef)} />;
  }

  renderAddPartButton() {
    return <Button
      color="primary"
      onClick={() => this.updateState({addDialog: true})}
      variant="contained">
      Add part
    </Button>;
  }

  renderMoveUpButton(id) {
    return <IconButton
      disabled={id <= 0}
      onClick={() => this.props.projectCtx.movePart(id, id - 1)}>
      <ArrowUpwardIcon />
    </IconButton>;
  }

  renderMoveDownButton(id) {
    return <IconButton
      disabled={id >= (this.props.projectCtx.parts.length - 1)}
      onClick={() => this.props.projectCtx.movePart(id, id + 1)}>
      <ArrowDownwardIcon />
    </IconButton>;
  }

  openPart(partId) {
    this.updateState({
      redirectTo: `/editor/sequence/part/${partId}`,
    });
  }

  renderPartItem(part, id) {
    if (part.type == "chapter") {
      return <ListItem
        key={id}
        onClick={() => this.openPart(id)}
        button>
        <ListItemText primary={part.title} />
        <ListItemSecondaryAction>
          {this.renderMoveUpButton(id)}
          {this.renderMoveDownButton(id)}
        </ListItemSecondaryAction>
      </ListItem>;
    }
    throw new Error(`Unknown part type: "${part.type}"`);
  }

  renderPartsItem() {
    return this.props.projectCtx.parts.map(
      (part, id) => this.renderPartItem(part, id));
  }

  renderPartsList() {
    if (this.props.projectCtx.parts.length == 0) {
      return <React.Fragment>
        <Typography variant="h5">
          This project currently have no parts.
        </Typography>
        {this.renderAddPartButton()}
      </React.Fragment>;
    }
    return <React.Fragment>
      <Typography variant="h5">
        Available parts in this project:
      </Typography>
      <List>
        {this.renderPartsItem()}
      </List>
      {this.renderAddPartButton()}
    </React.Fragment>;
  }

  renderPartEditor() {
    return null;
  }

  render() {
    if (!this.props.projectCtx.isOpen()) {
      return <Typography variant="body1">
        Loading…
      </Typography>;
    }
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <React.Fragment>
      {this.renderAddDialog()}
      {this.renderPartsList()}
      {this.renderPartEditor()}
    </React.Fragment>;
  }
}
Parts.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Parts);
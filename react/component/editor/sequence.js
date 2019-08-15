import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import ProjectCtx from "../../context/project";
import {isOpen} from "../../service/project";
import {addPart} from "../../service/project";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddPart from "./dialog/addpart";

class Sequence extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      redirectTo: null,
      addDialog: false,
      editingPart: null,
    });
  }

  componentDidMount() {
    if (!isOpen(this.props.projectCtx)) {
      this.updateState({redirectTo: "/editor"});
    }
  }

  handleOpenAddDialog() {
    this.updateState({
      addDialog: true,
    });
  }

  handleAddPart(partDef) {
    this.updateState({
      addDialog: false,
    }).then(() => addPart(this.props.projectCtx, partDef));
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

  renderPartItem(part, id) {
    if (part.type == "chapter") {
      return <ListItem
        key={id}
        button>
        <ListItemText primary={part.title} />
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
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    if (!isOpen(this.props.projectCtx)) {
      return <Typography variant="body1">
        Loading…
      </Typography>;
    }
    return <React.Fragment>
      {this.renderAddDialog()}
      {this.renderPartsList()}
      {this.renderPartEditor()}
    </React.Fragment>;
  }
}
Sequence.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Sequence);
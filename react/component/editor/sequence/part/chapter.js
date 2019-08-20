import React from "react";
import PropTypes from "prop-types";
import {Prompt} from "react-router-dom";
import ProjectCtx from "../../../../context/project";
import NotificationCtx from "../../../../context/notification";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import form from "@cley_faye/react-utils/lib/mixin/form";
import SaveIcon from "@material-ui/icons/Save";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import {notEmpty} from "@cley_faye/react-utils/lib/validator/string";
import {notificationEnum} from "../../../../service/notification";
import {withStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  fab: {
    position: "absolute",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  variantEditor: {
    padding: theme.spacing(2),
  },
});

class Chapter extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      partType: "chapter",
      partTitle: null,
      variants: [],
    });
    form(this, {
      partTitle: notEmpty("Part title can't be empty"),
    });
  }

  /** Check if the editor content needs to be saved */
  needSave() {
    return this.props.projectCtx.isPartDifferent(this.props.partId, this.state);
  }

  componentDidMount() {
    this.loadPart();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("PROP STUFF");
    if (prevProps.partId != this.props.partId) {
      this.loadPart();
      this.resetState();
    } else {
      this.validateUpdate(prevState);
    }
  }

  /** User hit save */
  handleSave() {
    this.validateForm()
      .then(formValid => {
        if (!formValid) {
          return;
        }
        return this.handleSaveConfirm();
      });
  }

  /** Save request, form is valid */
  handleSaveConfirm() {
    return this.props.projectCtx.savePartFromContext(
      this.props.partId,
      this.state,
    ).then(() => this.props.notificationCtx.show(notificationEnum.partSaved));
  }

  loadPart() {
    const partId = this.props.partId;
    if (partId === undefined) {
      return;
    }
    this.updateState(this.props.projectCtx.loadPartIntoContext(partId));
  }

  renderSaveButton() {
    if (this.state.saved === null) {
      return null;
    }
    return <Fab
      className={this.props.classes.fab}
      color="primary"
      onClick={() => this.handleSave()}
      disabled={!this.needSave()} >
      <SaveIcon />
    </Fab>;
  }

  renderPrompt() {
    if (this.needSave() === true) {
      return <Prompt
        message="You have unsaved changes in this part; discard them?" />;
    }
    return null;
  }

  handleAddVariant() {
    const partVariants = this.state.partVariants.concat([""]);
    this.updateState({
      partVariants,
    });
  }

  handleRemoveVariant(variantId) {
    const partVariants = this.state.partVariants.slice();
    partVariants.splice(variantId, 1);
    this.updateState({
      partVariants,
    });
  }

  renderAddVariantButton(topButton) {
    if (topButton && this.state.partVariants.length < 4) {
      return null;
    }
    return <Button
      variant="contained"
      onClick={() => this.handleAddVariant()}
      color="primary">
      <NoteAddIcon />
      Add variant
    </Button>;
  }

  updateVariant(variantId, newValue) {
    const partVariants = this.state.partVariants.slice();
    partVariants[variantId] = newValue;
    this.updateState({
      partVariants,
    });
  }

  /** Render a single editor */
  renderVariantEditor(variantId) {
    return <Paper className={this.props.classes.variantEditor}>
      <TextField
        variant="filled"
        multiline
        label={`Variant ${variantId}`}
        value={this.state.partVariants[variantId]}
        onChange={e => this.updateVariant(variantId, e.target.value)} />
      <IconButton onClick={() => this.handleRemoveVariant(variantId)}>
        <DeleteIcon />
      </IconButton>
    </Paper>;
  }

  renderVariants() {
    const editors = [];
    for (let i = 0; i < this.state.partVariants.length; ++i) {
      editors.push(this.renderVariantEditor(i));
    }
    return <React.Fragment>
      {this.renderAddVariantButton(true)}
      {editors}
      {this.renderAddVariantButton(false)}
    </React.Fragment>;
  }

  render() {
    console.log("RENDER");
    if (this.state.partTitle === null) {
      return <span>Loading…</span>;
    }
    return <React.Fragment>
      <Typography variant="h4">
        Editing part &quot;{this.state.partTitle}&quot;
      </Typography>
      <TextField
        fullWidth
        variant="filled"
        label="Title"
        error={this.state.partTitleError !== null}
        helperText={this.state.partTitleError}
        value={this.state.partTitle}
        onChange={this.changeHandler("partTitle")} />
      {this.renderVariants()}
      {this.renderSaveButton()}
      {this.renderPrompt()}
    </React.Fragment>;
  }
}
Chapter.propTypes = {
  projectCtx: PropTypes.object,
  notificationCtx: PropTypes.object,
  partId: PropTypes.number,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  NotificationCtx.withCtx(
    ProjectCtx.withCtx(Chapter)));
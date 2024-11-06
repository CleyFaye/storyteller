import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import form from "@cley_faye/react-utils/lib/mixin/form.js";
import {notEmpty} from "@cley_faye/react-utils/lib/validator/string.js";
import {TextField, Typography, Button, Paper, withStyles, IconButton, Fab} from "@material-ui/core";
import {Save as SaveIcon, NoteAdd as NoteAddIcon, Delete as DeleteIcon} from "@material-ui/icons";
import PropTypes from "prop-types";
import React from "react";
import {Prompt} from "react-router-dom";

import NotificationCtx from "../../../../context/notification.js";
import ProjectCtx from "../../../../context/project.js";
import SaveCtx from "../../../../context/save.js";

import {notificationEnum} from "../../../../service/notification.js";

/* eslint-disable no-magic-numbers */
const styles = (theme) => ({
  fab: {
    bottom: theme.spacing(2),
    position: "absolute",
    right: theme.spacing(2),
  },
  variantEditor: {
    padding: theme.spacing(2),
  },
});
/* eslint-enable no-magic-numbers */

const HIDE_TOP_BUTTON_UNDER = 4;

class Chapter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultState = {partTitle: null, partType: "chapter", variants: []};
    this.state = {...this.defaultState};
    this.validateForm = form(this, {
      partTitle: notEmpty("Part title can't be empty"),
    });
    this.handleChange = changeHandlerMixin(this);
  }

  /** Check if the editor content needs to be saved */
  needSave = () => this.props.projectCtx.isPartDifferent(this.props.partId, this.state);

  componentDidMount = () => {
    this.loadPart();
    this.props.saveCtx.registerEditor(this);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.partId !== this.props.partId) {
      this.loadPart();
      this.setState({...this.defaultState});
    }
    this.props.saveCtx.updateSaveState();
  };

  componentWillUnmount = () => {
    this.props.saveCtx.unregisterEditor(this);
  };

  /** User hit save */
  handleSave = () => {
    (async () => {
      const formValid = await this.validateForm();
      if (!formValid) {
        return;
      }
      return this.doSave();
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  /** Save request, form is valid */
  doSave = () => {
    this.props.projectCtx.savePartFromContext(this.props.partId, this.state);
    this.props.notificationCtx.show(notificationEnum.partSaved);
    this.props.saveCtx.updateSaveState();
  };

  loadPart = () => {
    const partId = this.props.partId;
    if (partId === undefined) {
      return;
    }
    this.setState(this.props.projectCtx.loadPartIntoContext(partId));
  };

  renderSaveButton = () => {
    if (this.state.saved === null) {
      return null;
    }
    return (
      <Fab
        className={this.props.classes.fab}
        color="primary"
        disabled={!this.needSave()}
        onClick={this.handleSave}
      >
        <SaveIcon />
      </Fab>
    );
  };

  renderPrompt = () => {
    if (this.needSave() === true) {
      return <Prompt message="You have unsaved changes in this part; discard them?" />;
    }
    return null;
  };

  handleAddVariant = () => {
    this.setState((oldState) => ({
      partVariants: oldState.partVariants.concat([""]),
    }));
  };

  handleRemoveVariant = (variantId) => {
    this.setState((oldState) => {
      const partVariants = oldState.partVariants.slice();
      partVariants.splice(variantId, 1);
      return {
        partVariants,
      };
    });
  };

  renderAddVariantButton = (topButton) => {
    if (topButton && this.state.partVariants.length < HIDE_TOP_BUTTON_UNDER) {
      return null;
    }
    return (
      <Button color="primary" onClick={this.handleAddVariant} variant="contained">
        <NoteAddIcon />
        Add variant
      </Button>
    );
  };

  updateVariant = (variantId, newValue) => {
    this.setState((oldState) => {
      const partVariants = oldState.partVariants.slice();
      partVariants[variantId] = newValue;
      return {
        partVariants,
      };
    });
  };

  /** Render a single editor */
  renderVariantEditor = (variantId) => (
    <Paper className={this.props.classes.variantEditor} key={variantId}>
      <TextField
        fullWidth
        label={`Variant ${variantId}`}
        multiline
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(e) => this.updateVariant(variantId, e.target.value)}
        value={this.state.partVariants[variantId]}
        variant="filled"
      />
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <IconButton onClick={() => this.handleRemoveVariant(variantId)}>
        <DeleteIcon />
      </IconButton>
    </Paper>
  );

  renderVariants = () => {
    const editors = [];
    for (let i = 0; i < this.state.partVariants.length; ++i) {
      editors.push(this.renderVariantEditor(i));
    }
    return (
      <>
        {this.renderAddVariantButton(true)}
        {editors}
        {this.renderAddVariantButton(false)}
      </>
    );
  };

  render = () => {
    if (this.state.partTitle === null) {
      return <span>Loading…</span>;
    }
    return (
      <>
        <Typography variant="h4">Editing part &quot;{this.state.partTitle}&quot;</Typography>
        <TextField
          error={this.state.partTitleError !== null}
          fullWidth
          helperText={this.state.partTitleError}
          label="Title"
          onChange={this.handleChange}
          value={this.state.partTitle}
          variant="filled"
        />
        {this.renderVariants()}
        {this.renderSaveButton()}
        {this.renderPrompt()}
      </>
    );
  };
}
Chapter.propTypes = {
  classes: PropTypes.object.isRequired,
  notificationCtx: PropTypes.object,
  partId: PropTypes.number,
  projectCtx: PropTypes.object,
  saveCtx: PropTypes.object,
};

export default withStyles(styles)(
  NotificationCtx.withCtx(ProjectCtx.withCtx(SaveCtx.withCtx(Chapter))),
);

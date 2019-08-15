import React from "react";
import PropTypes from "prop-types";
import ProjectCtx from "../../context/project";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import SaveIcon from "@material-ui/icons/Save";
import {isOpen} from "../../service/project";
import {needSave} from "../../service/project";
import {saveProject} from "../../service/project";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import Snackbar from "@material-ui/core/Snackbar";

/** Display the "save" button for the current project */
class SaveButton extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      errorPopup: false,
    });
  }

  handleSave() {
    saveProject(this.props.projectCtx)
      .catch(() => this.updateState({errorPopup: true}));
  }

  renderSnackbar() {
    // TODO move this into a globally available "snackbar" component
    return <Snackbar
      open={this.state.errorPopup}
      autoHideDuration={6000}
      onClose={() => this.updateState({errorPopup: false})}
      message="An error occured while saving" />;
  }

  render() {
    if (!isOpen(this.props.projectCtx)) {
      return null;
    }
    if (needSave(this.props.projectCtx)) {
      return <React.Fragment>
        {this.renderSnackbar()}
        <IconButton color="inherit" onClick={() => this.handleSave()}>
          <Badge color="secondary" variant="dot">
            <SaveIcon />
          </Badge>
        </IconButton>
      </React.Fragment>;
    }
    return <React.Fragment>
      {this.renderSnackbar()}
      <IconButton color="inherit">
        <SaveIcon />
      </IconButton>
    </React.Fragment>;
  }
}
SaveButton.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(SaveButton);
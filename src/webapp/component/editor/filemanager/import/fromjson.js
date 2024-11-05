import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {DropzoneArea} from "material-ui-dropzone";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import ProjectCtx from "../../../../context/project";
import {listExisting} from "../../../../service/project";

const loadFileContent = file => new Promise((resolve, reject) => {
  var reader = new FileReader();
  reader.onload = e => {
    resolve(e.target.result);
  };
  reader.onerror = e => {
    reject(e);
  };
  reader.readAsText(file);
});

const State = {
  GETFILE: Symbol("GETFILE"),
  LOADING: Symbol("LOADING"),
  GETTITLE: Symbol("GETTITLE"),
  CONFIRM_ERASE: Symbol("CONFIRM_ERASE"),
  DONE: Symbol("DONE"),
};

class FromJSON extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      state: State.GETFILE,
      loadedData: null,
      title: "",
      error: null,
    });
    changeHandler(this);
  }

  renderSaveWarning() {
    if (!this.props.projectCtx.needSave()) {
      return null;
    }
    return <Typography variant="overline">
      Importing a project will close the currently open project. Make sure to
      save your changes if needed!
    </Typography>;
  }

  cancelLoad() {
    this.resetState();
  }

  handleFile(file) {
    this.updateState({state: State.LOADING})
      .then(() => this.loadFile(file));
  }

  loadFile(file) {
    loadFileContent(file)
      .then(fileContent => {
        const data = JSON.parse(fileContent);
        if (data.magicVersion === 1) {
          return this.loadFileStorandomy(data);
        }
        if (data.magicVersion === 2) {
          return this.loadFileV2(data);
        }
        throw new Error("Unsupported file format");
      })
      .catch(error => {
        console.error(error);
        this.updateState({
          error: error ? error.toString() : "?",
        });
      });
  }

  loadFileStorandomy(data) {
    const loadedData = [];
    data.chapters.forEach((chapter, id) => {
      const variants = chapter;
      const title = `Chapter ${id + 1}`;
      loadedData.push({
        type: "chapter",
        title,
        variants,
      });
    });
    return this.updateState({
      loadedData,
      title: "Unnamed project",
      state: State.GETTITLE,
    });
  }

  loadFileV2(data) {
    return this.updateState({
      loadedData: data.parts,
      title: data.title,
      state: State.GETTITLE,
    });
  }

  confirmTitle() {
    if (this.state.title.length === 0) {
      return;
    }
    listExisting().then(
      existingProjects => {
        if (existingProjects.includes(this.state.title)) {
          this.updateState({state: State.CONFIRM_ERASE});
        } else {
          this.handleConfirmErase();
        }
      }
    ).catch(() => this.updateState({error: "Network error"}));
  }

  handleConfirmErase() {
    this.updateState({state: State.LOADING})
      .then(() => this.props.projectCtx.newProject({
        title: this.state.title,
      })).then(
        () => this.state.loadedData.reduce(
          (acc, cur) => acc.then(() => this.props.projectCtx.addPart(cur)),
          Promise.resolve()
        )
      ).then(() => this.updateState({state: State.DONE}))
      .catch(error => this.updateState({error: error
        ? error.toString()
        : "Unknown error"}));
  }

  renderFileField() {
    return <React.Fragment>
      <DropzoneArea
        acceptedFiles={[]}
        filesLimit={1}
        dropzoneText="Drop your file here"
        onDrop={files => this.handleFile(files)}
      />
    </React.Fragment>;
  }

  renderLoading() {
    return "Loading…";
  }

  renderGetTitle() {
    return <React.Fragment>
      <TextField
        label="Imported project title"
        value={this.state.title}
        onChange={this.changeHandler("title")}
        variant="outlined"
      />
      <br />
      <Button
        onClick={() => this.confirmTitle()}
        disabled={this.state.title.length === 0}
        variant="contained">
        Import with that title
      </Button>
      <br />
      <Button
        onClick={() => this.cancelLoad()}
        variant="contained">
        Cancel
      </Button>
    </React.Fragment>;
  }

  renderConfirmErase() {
    return <React.Fragment>
      <Typography variant="body1">
        A project with that name already exist. Do you want to replace it?
      </Typography>
      <br />
      <Button
        variant="contained"
        onClick={() => this.handleConfirmErase()} >
        Yes, replace it
      </Button>
      <br />
      <Button
        variant="contained"
        onClick={() => this.updateState({state: State.GETTITLE})} >
        No, pick a new name
      </Button>
    </React.Fragment>;
  }

  renderDone() {
    return <Redirect to="/editor/welcome" />;
  }

  renderStateElement() {
    switch (this.state.state) {
    case State.GETFILE:
      return this.renderFileField();
    case State.LOADING:
      return this.renderLoading();
    case State.GETTITLE:
      return this.renderGetTitle();
    case State.CONFIRM_ERASE:
      return this.renderConfirmErase();
    case State.DONE:
      return this.renderDone();
    default:
      throw new Error(`Unexpected state ${this.state.state}`);
    }
  }

  renderError() {
    return <React.Fragment>
      <Typography variant="h4">
      An error occured: {this.state.error}
      </Typography>
      <br />
      <Button variant="contained" onClick={() => this.cancelLoad()}>
        Go back
      </Button>
    </React.Fragment>;
  }

  render() {
    if (this.state.error) {
      return this.renderError();
    }
    return <React.Fragment>
      {this.renderSaveWarning()}
      {this.renderStateElement()}
    </React.Fragment>;
  }
}
FromJSON.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(FromJSON);
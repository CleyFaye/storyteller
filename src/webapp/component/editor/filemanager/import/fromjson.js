import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import {Button, TextField, Typography} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";
import PropTypes from "prop-types";
import React from "react";
import {Redirect} from "react-router-dom";

import ProjectCtx from "../../../../context/project.js";
import {listExisting} from "../../../../service/project.js";
import {magicVersion1, magicVersion2} from "../../../../service/setting.js";

const loadFileContent = (file) =>
  // eslint-disable-next-line promise/avoid-new
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file[0]);
  });

const State = {
  CONFIRM_ERASE: Symbol("CONFIRM_ERASE"),
  DONE: Symbol("DONE"),
  GETFILE: Symbol("GETFILE"),
  GETTITLE: Symbol("GETTITLE"),
  LOADING: Symbol("LOADING"),
};

class FromJSON extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultState = {
      error: null,
      loadedData: null,
      state: State.GETFILE,
      title: "",
    };
    this.state = {...this.defaultState};
    this.handleChange = changeHandlerMixin(this);
  }

  renderSaveWarning = () => {
    if (!this.props.projectCtx.needSave()) {
      return null;
    }
    return (
      <Typography variant="overline">
        Importing a project will close the currently open project. Make sure to save your changes if
        needed!
      </Typography>
    );
  };

  handleCancelLoad = () => {
    this.setState({...this.defaultState});
  };

  handleFile = (file) => {
    this.setState({state: State.LOADING});
    // eslint-disable-next-line promise/prefer-await-to-then
    this.loadFile(file).catch((error) => {
      this.setState({error: error ? error.toString() : "?"});
    });
  };

  loadFile = async (file) => {
    const fileContent = await loadFileContent(file);
    const data = JSON.parse(fileContent);
    if (data.magicVersion === magicVersion1) {
      return this.loadFileStorandomy(data);
    }
    if (data.magicVersion === magicVersion2) {
      return this.loadFileV2(data);
    }
    throw new Error("Unsupported file format");
  };

  loadFileStorandomy = (data) => {
    const loadedData = [];
    data.chapters.forEach((chapter, id) => {
      const variants = chapter;
      const title = `Chapter ${id + 1}`;
      loadedData.push({
        title,
        type: "chapter",
        variants,
      });
    });
    this.setState({
      loadedData,
      state: State.GETTITLE,
      title: "Unnamed project",
    });
  };

  loadFileV2 = (data) => {
    this.setState({
      loadedData: data.parts,
      state: State.GETTITLE,
      title: data.title,
    });
  };

  handleConfirmTitle = () => {
    if (this.state.title.length === 0) {
      return;
    }
    (async () => {
      const existingProjects = await listExisting();
      if (existingProjects.includes(this.state.title)) {
        this.setState({state: State.CONFIRM_ERASE});
      } else {
        this.handleConfirmErase();
      }
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => this.setState({error: "Network error"}));
  };

  handleConfirmErase = () => {
    this.props.projectCtx.newProject({title: this.state.title});
    this.state.loadedData.forEach((cur) => this.props.projectCtx.addPart(cur));
    this.setState({state: State.DONE});
  };

  renderFileField = () => (
    <DropzoneArea
      acceptedFiles={[]}
      dropzoneText="Drop your file here"
      filesLimit={1}
      onDrop={this.handleFile}
    />
  );

  static renderLoading = () => "Loading…";

  renderGetTitle = () => (
    <>
      <TextField
        label="Imported project title"
        name="title"
        onChange={this.handleChange}
        value={this.state.title}
        variant="outlined"
      />
      <br />
      <Button
        disabled={this.state.title.length === 0}
        onClick={this.handleConfirmTitle}
        variant="contained"
      >
        Import with that title
      </Button>
      <br />
      <Button onClick={this.handleCancelLoad} variant="contained">
        Cancel
      </Button>
    </>
  );

  handlePickTitle = () => {
    this.setState({state: State.GETTITLE});
  };

  renderConfirmErase = () => (
    <>
      <Typography variant="body1">
        A project with that name already exist. Do you want to replace it?
      </Typography>
      <br />
      <Button onClick={this.handleConfirmErase} variant="contained">
        Yes, replace it
      </Button>
      <br />
      <Button onClick={this.handlePickTitle} variant="contained">
        No, pick a new name
      </Button>
    </>
  );

  static renderDone = () => <Redirect to="/editor/welcome" />;

  renderStateElement = () => {
    switch (this.state.state) {
      case State.GETFILE:
        return this.renderFileField();
      case State.LOADING:
        return FromJSON.renderLoading();
      case State.GETTITLE:
        return this.renderGetTitle();
      case State.CONFIRM_ERASE:
        return this.renderConfirmErase();
      case State.DONE:
        return FromJSON.renderDone();
      default:
        throw new Error(`Unexpected state ${this.state.state}`);
    }
  };

  renderError = () => (
    <>
      <Typography variant="h4">An error occured: {this.state.error}</Typography>
      <br />
      <Button onClick={this.handleCancelLoad} variant="contained">
        Go back
      </Button>
    </>
  );

  render = () => {
    if (this.state.error) {
      return this.renderError();
    }
    return (
      <>
        {this.renderSaveWarning()}
        {this.renderStateElement()}
      </>
    );
  };
}
FromJSON.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(FromJSON);

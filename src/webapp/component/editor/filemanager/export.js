import {Typography, Button} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

import ProjectCtx from "../../../context/project.js";

class Export extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {link: null};
  }

  componentDidMount = () => {
    if (!this.props.projectCtx.isOpen()) {
      return;
    }
    (async () => {
      const projectData = await this.props.projectCtx.exportProject();
      console.log("recreate link");
      const blob = new Blob([JSON.stringify(projectData)], {type: "application/json"});
      const url = window.URL.createObjectURL(blob);
      this.setState({link: url});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  componentWillUnmount = () => {
    if (this.state.link !== null) {
      window.URL.revokeObjectURL(this.state.link);
    }
  };

  getFileName = () => {
    if (!this.props.projectCtx.title) {
      return "unknown.json";
    }
    return `${this.props.projectCtx.title}.json`;
  };

  render = () => {
    if (!this.props.projectCtx.isOpen()) {
      return <Typography variant="h4">No project open.</Typography>;
    }
    return (
      <>
        <Typography variant="h4">
          You can save the currently open project in its current state by clicking on the button
          below.
        </Typography>
        <br />
        <Button
          disabled={this.state.link === null}
          download={this.getFileName()}
          href={this.state.link ? this.state.link : ""}
          variant="contained"
        >
          Download project {this.props.projectCtx.title}
        </Button>
      </>
    );
  };
}
Export.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Export);

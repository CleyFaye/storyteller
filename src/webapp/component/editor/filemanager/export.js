import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import ProjectCtx from "../../../context/project";

class Export extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      link: null,
    });
  }

  componentDidMount() {
    if (!this.props.projectCtx.isOpen()) {
      return;
    }
    this.props.projectCtx.exportProject().then(projectData => {
      console.log("recreate link");
      const blob = new Blob(
        [JSON.stringify(projectData)],
        {type: "application/json"}
      );
      const url = window.URL.createObjectURL(blob);
      this.updateState({link: url});
    });
  }

  componentWillUnmount() {
    if (this.state.link !== null) {
      window.URL.revokeObjectURL(this.state.link);
    }
  }

  getFileName() {
    if (!this.props.projectCtx.title) {
      return "unknown.json";
    }
    return `${this.props.projectCtx.title}.json`;
  }

  render() {
    if (!this.props.projectCtx.isOpen()) {
      return <Typography variant="h4">
        No project open.
      </Typography>;
    }
    return <React.Fragment>
      <Typography variant="h4">
        You can save the currently open project in its current state by clicking
        on the button below.
      </Typography>
      <br />
      <Button
        variant="contained"
        href={this.state.link ? this.state.link : ""}
        disabled={this.state.link == null}
        download={this.getFileName()}>
        Download project {this.props.projectCtx.title}
      </Button>

    </React.Fragment>;
  }
}
Export.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Export);
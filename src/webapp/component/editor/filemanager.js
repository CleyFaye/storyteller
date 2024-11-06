/* eslint-disable max-classes-per-file */
import {AppBar, Tabs, Tab, Typography, Box} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

import ProjectCtx from "../../context/project.js";

import Export from "./filemanager/export.js";
import Import from "./filemanager/import.js";

class FileManagerPanel extends React.PureComponent {
  render = () => (
    <Typography component="div" hidden={this.props.value !== this.props.index} role="tabpanel">
      <Box p={3}>{this.props.children}</Box>
    </Typography>
  );
}
FileManagerPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any,
  value: PropTypes.any,
};

class FileManager extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  renderExportPanel = () => {
    if (this.props.projectCtx.isOpen()) {
      return <Export />;
    }
    return <Typography variant="h4">No project open.</Typography>;
  };

  handleChange = (_, value) => {
    this.setState({value});
  };

  render = () => (
    <>
      <AppBar position="static">
        <Tabs onChange={this.handleChange} value={this.state.value}>
          <Tab label="Import" />
          <Tab label="Export" />
        </Tabs>
      </AppBar>
      <FileManagerPanel index={0} value={this.state.value}>
        <Import />
      </FileManagerPanel>
      <FileManagerPanel index={1} value={this.state.value}>
        {this.renderExportPanel()}
      </FileManagerPanel>
    </>
  );
}
FileManager.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(FileManager);

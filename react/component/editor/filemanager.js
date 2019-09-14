import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import Import from "./filemanager/import";
import Export from "./filemanager/export";
import ProjectCtx from "../../context/project";

class FileManagerPanel extends React.Component {
  render() {
    return <Typography
      component="div"
      role="tabpanel"
      hidden={this.props.value !== this.props.index}>
      <Box p={3}>{this.props.children}</Box>
    </Typography>;
  }
}
FileManagerPanel.propTypes = {
  value: PropTypes.any,
  index: PropTypes.any,
  children: PropTypes.node,
};

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      value: 0,
    });
    changeHandler(this);
  }

  renderExportPanel() {
    if (this.props.projectCtx.isOpen()) {
      return <Export />;
    }
    return <Typography variant="h4">
      No project open.
    </Typography>;
  }

  render() {
    return <React.Fragment>
      <AppBar position="static">
        <Tabs
          value={this.state.value}
          onChange={(_, value) => this.updateState({value})}>
          <Tab label="Import" />
          <Tab label="Export" />
        </Tabs>
      </AppBar>
      <FileManagerPanel value={this.state.value} index={0}>
        <Import />
      </FileManagerPanel>
      <FileManagerPanel value={this.state.value} index={1}>
        {this.renderExportPanel()}
      </FileManagerPanel>
    </React.Fragment>;
  }
}
FileManager.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(FileManager);
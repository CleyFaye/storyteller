/* eslint-disable max-classes-per-file */
import {AppBar, Box, Tab, Tabs, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

import FromJSON from "./import/fromjson.js";

class ImportPanel extends React.PureComponent {
  render() {
    return (
      <Typography component="div" hidden={this.props.value !== this.props.index} role="tabpanel">
        <Box p={3}>{this.props.children}</Box>
      </Typography>
    );
  }
}
ImportPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any,
  value: PropTypes.any,
};

class Import extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: 0};
  }

  handleChange = (_, value) => {
    this.setState({value});
  };

  render() {
    return (
      <>
        <AppBar position="static">
          <Tabs onChange={this.handleChange} value={this.state.value}>
            <Tab label="From JSON file" />
          </Tabs>
        </AppBar>
        <ImportPanel index={0} value={this.state.value}>
          <FromJSON />
        </ImportPanel>
      </>
    );
  }
}
Import.propTypes = {};

export default Import;

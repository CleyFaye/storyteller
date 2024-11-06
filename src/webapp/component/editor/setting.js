/* eslint-disable max-classes-per-file */
import {AppBar, Tabs, Tab, Typography, Box} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

import Font from "./setting/font.js";
import Printer from "./setting/printer.js";
import Theme from "./setting/theme.js";

class SettingPanel extends React.PureComponent {
  render() {
    return (
      <Typography component="div" hidden={this.props.value !== this.props.index} role="tabpanel">
        <Box p={3}>{this.props.children}</Box>
      </Typography>
    );
  }
}
SettingPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any,
  value: PropTypes.any,
};

class Setting extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (_, value) => this.setState({value});

  render() {
    return (
      <>
        <AppBar position="static">
          <Tabs onChange={this.handleChange} value={this.state.value}>
            <Tab label="Printer" />
            <Tab label="Font" />
            <Tab label="Theme" />
            <Tab label="Updates" />
          </Tabs>
        </AppBar>
        <SettingPanel index={0} value={this.state.value}>
          <Printer />
        </SettingPanel>
        <SettingPanel index={1} value={this.state.value}>
          <Font />
        </SettingPanel>
        <SettingPanel index={2} value={this.state.value}>
          <Theme />
        </SettingPanel>
        <SettingPanel index={3} value={this.state.value}>
          Update page (yeah still not done)
        </SettingPanel>
      </>
    );
  }
}
Setting.propTypes = {};

export default Setting;

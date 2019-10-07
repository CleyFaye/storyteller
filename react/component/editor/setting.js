import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import Printer from "./setting/printer";
import Theme from "./setting/theme";

class SettingPanel extends React.Component {
  render() {
    return <Typography
      component="div"
      role="tabpanel"
      hidden={this.props.value !== this.props.index}>
      <Box p={3}>{this.props.children}</Box>
    </Typography>;
  }
}
SettingPanel.propTypes = {
  value: PropTypes.any,
  index: PropTypes.any,
  children: PropTypes.node,
};

class Setting extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      value: 0,
    });
    changeHandler(this);
  }

  render() {
    return <React.Fragment>
      <AppBar position="static">
        <Tabs
          value={this.state.value}
          onChange={(_, value) => this.updateState({value})}>
          <Tab label="Printer" />
          <Tab label="Theme" />
          <Tab label="Updates" />
        </Tabs>
      </AppBar>
      <SettingPanel value={this.state.value} index={0}>
        <Printer />
      </SettingPanel>
      <SettingPanel value={this.state.value} index={1}>
        <Theme />
      </SettingPanel>
      <SettingPanel value={this.state.value} index={2}>
        Update page (yeah still not done)
      </SettingPanel>
    </React.Fragment>;
  }
}
Setting.propTypes = {
};

export default Setting;
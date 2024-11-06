import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import {TextField, Typography, Button, Checkbox, Box, FormControlLabel} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

import NotificationCtx from "../../../context/notification.js";
import {notificationEnum} from "../../../service/notification.js";
import {test as testPrint, list as listPrinters} from "../../../service/printer.js";
import {getAll, setAll} from "../../../service/setting.js";

class Printer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      binPath: "",
      duplex: true,
      loading: true,
      printerName: "",
      printers: null,
    };
    this.handleChange = changeHandlerMixin(this);
  }

  componentDidMount() {
    (async () => {
      const remoteConfig = await getAll();
      const printers = await listPrinters();
      this.setState({...remoteConfig, loading: false, printers});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  }

  handleSave = () => {
    this.setState({loading: true})(async () => {
      await setAll({
        printerName: this.state.printerName,
        binPath: this.state.binPath,
      });
      this.setState({loading: false});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  _renderSaveButton = () => (
    <Button color="primary" onClick={this.handleSave}>
      Save settings
    </Button>
  );

  handleTestPrinter = () => {
    (async () => {
      await testPrint(this.state.binPath, this.state.printerName, this.state.duplex);
      this.props.notificationCtx.show(notificationEnum.testPrint);
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => this.props.notificationCtx.show(notificationEnum.networkReadError));
  };

  renderPrinterList = () => {
    if (this.state.printers === null) {
      return;
    }
    return (
      <>
        <br />
        {this.state.printers.map((printerName) => (
          // eslint-disable-next-line react/jsx-no-bind
          <Button color="secondary" key={printerName} onClick={() => this.setState({printerName})}>
            {printerName}
          </Button>
        ))}
        <br />
      </>
    );
  };

  render = () => {
    if (this.state.loading) {
      return <Typography variant="h4">Loading…</Typography>;
    }
    return (
      <>
        {this._renderSaveButton()}
        <Box>
          <TextField
            fullWidth
            label="Printer name"
            name="printerName"
            onChange={this.handleChange}
            value={this.state.printerName}
            variant="filled"
          />
          {this.renderPrinterList()}
          <TextField
            fullWidth
            label="Ghostscript path (windows) or lp path (unix-like)"
            name="binPath"
            onChange={this.handleChange}
            value={this.state.binPath}
            variant="filled"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.duplex}
                color="primary"
                onChange={this.changeCheckboxHandler("duplex")}
              />
            }
            label="Two-sided printing (linux only)"
          />
          <br />
          <Button
            color="secondary"
            disabled={this.state.printerName.length === 0}
            onClick={this.handleTestPrinter}
          >
            Test printer
          </Button>
        </Box>
        {this._renderSaveButton()}
      </>
    );
  };
}
Printer.propTypes = {
  notificationCtx: PropTypes.object,
};

export default NotificationCtx.withCtx(Printer);

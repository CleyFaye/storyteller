import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import NotificationCtx from "../../../context/notification";
import Box from "@material-ui/core/Box";
import {notificationEnum} from "../../../service/notification";
import {getAll} from "../../../service/setting";
import {setAll} from "../../../service/setting";
import {test as testPrint} from "../../../service/printer";
import {list as listPrinters} from "../../../service/printer";

class Printer extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      printerName: "",
      binPath: "",
      duplex: true,
      loading: true,
      printers: null,
    });
    changeHandler(this);
  }

  componentDidMount() {
    getAll()
      .then(remoteConfig => this.updateState(remoteConfig))
      .then(() => listPrinters())
      .then(printers => this.updateState({
        loading: false,
        printers,
      }));
  }

  handleSave() {
    this.updateState({loading: true})
      .then(() => setAll({
        printerName: this.state.printerName,
        binPath: this.state.binPath,
      }))
      .then(() => this.updateState({loading: false}));
  }

  _renderSaveButton() {
    return <Button
      color="primary"
      onClick={() => this.handleSave()}>
      Save settings
    </Button>;
  }

  testPrinter() {
    testPrint(this.state.binPath, this.state.printerName, this.state.duplex)
      .then(() => this.props.notificationCtx.show(
        notificationEnum.testPrint
      ))
      .catch(() => this.props.notificationCtx.show(
        notificationEnum.networkReadError
      ));
  }

  renderPrinterList() {
    if (this.state.printers === null) {
      return;
    }
    return <React.Fragment>
      <br />
      {this.state.printers.map((printerName, id) => 
        <Button
          key={id}
          color="secondary"
          onClick={() => this.updateState({printerName})}>
          {printerName}
        </Button>
      )}
      <br />
    </React.Fragment>;
  }

  render() {
    if (this.state.loading) {
      return <Typography variant="h4">Loading…</Typography>;
    }
    return <React.Fragment>
      {this._renderSaveButton()}
      <Box>
        <TextField
          variant="filled"
          label="Printer name"
          value={this.state.printerName}
          onChange={this.changeHandler("printerName")}
          fullWidth />
        {this.renderPrinterList()}
        <TextField
          variant="filled"
          label="Ghostscript path (windows) or lp path (unix-like)"
          value={this.state.binPath}
          onChange={this.changeHandler("binPath")}
          fullWidth />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.duplex}
              onChange={this.changeCheckboxHandler("duplex")}
              color="primary" />
          }
          label="Two-sided printing (linux only)"
        />
        <br />
        <Button
          color="secondary"
          disabled={this.state.printerName.length == 0}
          onClick={() => this.testPrinter()}>
        Test printer
        </Button>
      </Box>
      {this._renderSaveButton()}
    </React.Fragment>;
  }
}
Printer.propTypes = {
  notificationCtx: PropTypes.object,
};

export default NotificationCtx.withCtx(Printer);
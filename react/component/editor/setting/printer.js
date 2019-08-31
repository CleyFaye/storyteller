import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import NotificationCtx from "../../../context/notification";
import Box from "@material-ui/core/Box";
import {notificationEnum} from "../../../service/notification";
import {getAll} from "../../../service/setting";
import {setAll} from "../../../service/setting";
import {test as testPrint} from "../../../service/printer";

class Printer extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      printerName: "",
      loading: true,
    });
    changeHandler(this);
  }

  componentDidMount() {
    getAll()
      .then(remoteConfig => this.updateState(remoteConfig))
      .then(() => this.updateState({loading: false}));
  }

  handleSave() {
    this.updateState({loading: true})
      .then(() => setAll({
        printerName: this.state.printerName,
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
    testPrint(this.state.printerName)
      .then(() => this.props.notificationCtx.show(
        notificationEnum.testPrint
      ))
      .catch(() => this.props.notificationCtx.show(
        notificationEnum.networkReadError
      ));
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
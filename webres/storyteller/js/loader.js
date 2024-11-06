import {CssBaseline} from "@material-ui/core";
// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom";

import AppSwitch from "../../../src/webapp/appswitch.js";

ReactDOM.render(
  <CssBaseline>
    <AppSwitch />
  </CssBaseline>,
  // eslint-disable-next-line no-undef
  document.querySelector(".app"),
);

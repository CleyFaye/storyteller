import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactDOM from "react-dom";

import AppSwitch from "../../../src/webapp/appswitch";

ReactDOM.render(
  <CssBaseline>
    <AppSwitch />
  </CssBaseline>,
  document.querySelector(".app")
);

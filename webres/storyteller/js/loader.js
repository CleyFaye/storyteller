import {CssBaseline} from "@material-ui/core";
import ReactDOM from "react-dom";

import AppSwitch from "../../../src/webapp/appswitch.js";

ReactDOM.render(
  <CssBaseline>
    <AppSwitch />
  </CssBaseline>,
  // eslint-disable-next-line no-undef
  document.querySelector(".app"),
);

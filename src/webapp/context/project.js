import createState from "@cley_faye/react-utils/lib/context/state.js";

import {contextFunctions} from "../service/project.js";

/** The currently loaded project data */
export default createState(
  "project",
  {
    parts: null,
    saved: null,
    title: null,
  },
  contextFunctions,
);

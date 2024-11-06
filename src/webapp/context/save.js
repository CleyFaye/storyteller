import createState from "@cley_faye/react-utils/lib/context/state.js";

import {contextFunctions} from "../service/save.js";

/** The currently loaded project data */
export default createState(
  "save",
  {
    activeEditors: [],
    editorNeedSave: null,
  },
  contextFunctions,
);

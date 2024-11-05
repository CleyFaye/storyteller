import createState from "@cley_faye/react-utils/lib/context/state";
import {contextFunctions} from "../service/save";

/** The currently loaded project data */
export default createState(
  "save",
  {
    activeEditors: [],
    editorNeedSave: null,
  },
  contextFunctions
);
import createState from "@cley_faye/react-utils/lib/context/state";
import {contextFunctions} from "../service/project";

/** The currently loaded project data */
export default createState(
  "project",
  {
    title: null,
    parts: null,
    saved: null,
  },
  contextFunctions
);
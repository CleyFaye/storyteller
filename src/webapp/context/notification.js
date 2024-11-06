import createState from "@cley_faye/react-utils/lib/context/state.js";

import {notificationEnum, contextFunctions} from "../service/notification.js";

/** Visible notifications */
export default createState(
  "notification",
  {
    ...Object.keys(notificationEnum).reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {}),
  },
  contextFunctions,
);

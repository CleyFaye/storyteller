import createState from "@cley_faye/react-utils/lib/context/state";
import {notificationEnum} from "../service/notification";

/** Visible notifications */
export default createState("notification", {
  ...Object.keys(notificationEnum).reduce((acc, cur) => {
    acc[cur] = false;
    return acc;
  }, {}),
});
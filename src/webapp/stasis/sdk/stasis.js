import {callAPI} from "./util";

export const openPicsDirectory = () => callAPI(
  "get",
  "/openDir",
);

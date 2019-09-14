import {callAPI} from "./util";

export const test = (binPath, printerName, duplex) =>
  callAPI("post", "/api/v1/printer/test", {
    binPath,
    printerName,
    duplex,
  });
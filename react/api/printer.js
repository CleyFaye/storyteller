import {callAPI} from "./util";

export const test = (ghostscript, printerName) =>
  callAPI("post", "/api/v1/printer/test", {
    ghostscript,
    printerName,
  });
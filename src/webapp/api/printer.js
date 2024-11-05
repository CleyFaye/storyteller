import {callAPI} from "./util";

export const test = (binPath, printerName, duplex) =>
  callAPI("post", "/api/v1/printer/test", {
    binPath,
    printerName,
    duplex,
  });

export const printStory = (paragraphs) =>
  callAPI("post", "/api/v1/printer/printStory", {
    paragraphs,
  });

export const list = () =>
  callAPI("post", "/api/v1/printer/list");
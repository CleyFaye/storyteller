import {callAPI} from "./util.js";

export const test = (binPath, printerName, duplex) =>
  callAPI("post", "/api/v1/printer/test", {
    binPath,
    duplex,
    printerName,
  });

export const printStory = (paragraphs) =>
  callAPI("post", "/api/v1/printer/printStory", {
    paragraphs,
  });

export const list = () => callAPI("post", "/api/v1/printer/list");

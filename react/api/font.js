import {callAPI} from "./util";

export const list = () =>
  callAPI("post", "/api/v1/font/list");
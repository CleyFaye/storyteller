import {callAPI} from "./util";

export const getAll = () =>
  callAPI("get", "/api/v1/setting/all");

export const setAll = settings =>
  callAPI("post", "/api/v1/setting/all", settings);
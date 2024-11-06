import {callAPI} from "./util.js";

export const list = () => callAPI("post", "/api/v1/theme/list");

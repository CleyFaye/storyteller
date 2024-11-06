import {callAPI} from "./util.js";

export const openPicsDirectory = () => callAPI("get", "/openDir");

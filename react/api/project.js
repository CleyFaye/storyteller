import {callAPI} from "./util";

/** List existing projects on the server
 * 
 * @return {string[]}
 * Name of existing projects
 */
export const listExisting = () =>
  callAPI("get", "/api/v1/project/listExisting");
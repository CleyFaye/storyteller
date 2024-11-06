import {callAPI} from "./util.js";

/** List existing projects on the server
 *
 * @return {Promise<string[]>}
 * Name of existing projects
 */
export const listExisting = () => callAPI("get", "/api/v1/project/listExisting");

/** Load data from a previously saved project
 *
 * @return {Promise<Object>}
 * JSON object containing the project data
 */
export const loadProject = (projectName) =>
  callAPI("get", "/api/v1/project/loadProject", {
    projectName,
  });

/** Save data on the server
 *
 * @param {Object} projectData
 * Data of the project as a serializable object
 *
 * @return {Promise}
 * Resolve when done
 */
export const saveProject = (projectName, projectData) =>
  callAPI("put", "/api/v1/project/saveProject", {
    projectName,
    projectData,
  });

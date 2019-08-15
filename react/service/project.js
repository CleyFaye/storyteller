import {listExisting as apiListExisting} from "../api/project";

/** Start a new project.
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @param {Object} projectSettings
 * New project's configuration
 * 
 * @param {string} projectSettings.title
 * New project's title
 * 
 * @return {Promise}
 * Resolve when done
 */
export const newProject = (projectCtx, projectSettings) =>
  projectCtx.update({
    title: projectSettings.title,
    parts: [],
    saved: false,
  });

/** Load a project from a V1 file
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @param {Object} projectData
 * Data to load
 * 
 * @return {Promise}
 * Resolve when done
 */
const loadProjectV1 = (projectCtx, projectData) =>
  projectCtx.update({
    title: projectData.title,
    parts: projectData.parts,
    saved: true,
  });

/** Load a project from a JSON data block
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @param {Object} projectData
 * Data to load
 * 
 * @return {Promise}
 * Resolve when done
 */
export const loadProject = (projectCtx, projectData) => {
  if (projectData.version === undefined) {
    return Promise.reject(new Error("Unknown project version"));
  }
  switch (projectData.version) {
  case 1:
    return loadProjectV1(projectCtx, projectData);
  default:
    return Promise.reject(new Error("Unsupported project version"));
  }
};

/** Save the current project 
 * 
 * The project will not be marked as saved by this function call. To do so call
 * markSaved().
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @return {Promise}
 * Resolve with the data to save as a JSON-able object
 */
export const saveProject = projectCtx => Promise.resolve(
  {
    version: 1,
    title: projectCtx.title,
    parts: projectCtx.parts,
  }
);

/** Mark the current project as saved.
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @return {Promise}
 * Resolve when done
 */
export const markSaved = projectCtx =>
  projectCtx.update({
    saved: true,
  });

/** Determine if the project need saving
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @return {bool}
 * true if the project need saving
 */
export const needSave = projectCtx =>
  isOpen(projectCtx) && projectCtx.saved === false;

/** Check if a project is open
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @return {bool}
 * true if a project is open
 */
export const isOpen = projectCtx =>
  projectCtx.title !== null;

/** List existing projects on the server
 * 
 * @return {Promise<string[]>}
 * List of projects on the server
 */
export const listExisting = () => apiListExisting();
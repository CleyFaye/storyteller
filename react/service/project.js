import {listExisting as apiListExisting} from "../api/project";
import {loadProject as apiLoadProject} from "../api/project";
import {saveProject as apiSaveProject} from "../api/project";

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

/** Load a project from a name
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @param {string} projectName
 * Name of the project to open
 * 
 * @return {Promise}
 * Resolve when done
 */
export const loadProject = (projectCtx, projectName) =>
  apiLoadProject(projectName)
    .then(projectData => {
      if (projectData.version === undefined) {
        return Promise.reject(new Error("Unknown project version"));
      }
      switch (projectData.version) {
      case 1:
        return loadProjectV1(projectCtx, projectData);
      default:
        return Promise.reject(new Error("Unsupported project version"));
      }
    });

/** Save the current project 
 * 
 * @param {Object} projectCtx
 * Active project context
 * 
 * @return {Promise}
 * Resolve when saved
 */
export const saveProject = projectCtx => Promise.resolve(needSave(projectCtx))
  .then(haveToSave => {
    if (haveToSave) {
      return realSaveProject(projectCtx);
    }
  });

/** Perform a save regardless of the project state */
const realSaveProject = projectCtx => Promise.resolve(
  {
    version: 1,
    title: projectCtx.title,
    parts: projectCtx.parts,
  }
).then(
  projectData => apiSaveProject(projectCtx.title, projectData)
).then(
  () => projectCtx.update({saved: true})
);

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
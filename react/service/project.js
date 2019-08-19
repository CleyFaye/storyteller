import {listExisting as apiListExisting} from "../api/project";
import {loadProject as apiLoadProject} from "../api/project";
import {saveProject as apiSaveProject} from "../api/project";

/** Start a new project.
 * 
 * Bound to context
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
export const newProject = (ctx, projectSettings) =>
  ctx.update({
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
 * Bound to context
 * 
 * @param {string} projectName
 * Name of the project to open
 * 
 * @return {Promise}
 * Resolve when done
 */
export const loadProject = (ctx, projectName) =>
  apiLoadProject(projectName)
    .then(projectData => {
      if (projectData.version === undefined) {
        return Promise.reject(new Error("Unknown project version"));
      }
      switch (projectData.version) {
      case 1:
        return loadProjectV1(ctx, projectData);
      default:
        return Promise.reject(new Error("Unsupported project version"));
      }
    });

/** Save the current project 
 * 
 * Bound to context.
 * 
 * @return {Promise}
 * Resolve when saved
 */
export const saveProject = ctx => Promise.resolve(ctx.needSave())
  .then(haveToSave => {
    if (haveToSave) {
      return realSaveProject(ctx);
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
 * Bound to context
 * 
 * @return {bool}
 * true if the project need saving
 */
export const needSave = ctx =>
  ctx.isOpen() && ctx.saved === false;

/** Check if a project is open
 * 
 * Bound to context.
 * 
 * @return {bool}
 * true if a project is open
 */
export const isOpen = ctx =>
  ctx.title !== null;

/** List existing projects on the server
 * 
 * @return {Promise<string[]>}
 * List of projects on the server
 */
export const listExisting = () => apiListExisting();

/** Build an empty chapter part */
const buildNewChapterPart = partDef => ({
  type: "chapter",
  title: partDef.title,
  variants: [],
});

/** Create a new empty part from a basic definitions */
const buildNewPart = partDef => {
  switch (partDef.type) {
  case "chapter":
    return buildNewChapterPart(partDef);
  default:
    throw new Error(`Unknown part type: "${partDef.type}"`);
  }
};

/** Add a new part to the current project.
 * 
 * Bound to context.
*/
export const addPart = (ctx, partDef) =>
  ctx.update({
    parts: ctx.parts.concat([buildNewPart(partDef)]),
    saved: false,
  });

export const contextFunctions = {
  addPart,
  isOpen,
  loadProject,
  needSave,
  newProject,
  saveProject,
};
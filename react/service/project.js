import {listExisting as apiListExisting} from "../api/project";
import {loadProject as apiLoadProject} from "../api/project";
import {saveProject as apiSaveProject} from "../api/project";
import {buildNew as buildNewPart} from "./project/part";
import {loadIntoContext as loadPartIntoContextRaw} from "./project/part";
import {saveFromContext as savePartFromContextRaw} from "./project/part";
import {isDifferent as isPartDifferentRaw} from "./project/part";
import {getTitle as getPartTitleRaw} from "./project/part";

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

/** Add a new part to the current project.
 * 
 * Bound to context.
*/
export const addPart = (ctx, partDef) =>
  ctx.update({
    parts: ctx.parts.concat([buildNewPart(partDef)]),
    saved: false,
  });

/** Move a part to another index
 * 
 * Bound to context.
 * 
 * @param {number} from
 * Id of the part to move
 * 
 * @param {number} to
 * Part new index
 * 
 * @return {Promise}
 */
export const movePart = (ctx, from, to) => {
  const parts = ctx.parts.slice();
  parts.splice(to, 0, parts.splice(from, 1)[0]);
  return ctx.update({
    parts,
    saved: false,
  });
};

/** Delete a part.
 * 
 * Context bound.
 * 
 * @param {number} partId
 * Part to remove
 * 
 * @return {Promise}
 */
export const deletePart = (ctx, partId) => {
  const parts = ctx.parts.slice();
  parts.splice(partId, 1);
  return ctx.update({parts, saved: false});
};

/** Extract data from a part and return the useful fields
 * 
 * Always return copies, not reference to the context object itself.
 * 
 * - chapter: return title and variants
 * 
 * Context bound.
 * 
 * @param {number} partId
 * 
 * @return {Object}
 */
export const loadPartIntoContext = (ctx, partId) =>
  loadPartIntoContextRaw(ctx.parts[partId]);

/** Replace a part from data provided by an editor context
 * 
 * Context bound.
 * 
 * @param {number} partId
 * 
 * @param {Object} contextData
 * The data updated from the result of loadPartIntoContext()
 * 
 * @return {Promise}
 */
export const savePartFromContext = (ctx, partId, contextData) => {
  const parts = ctx.parts.slice();
  parts[partId] = savePartFromContextRaw(contextData);
  return ctx.update({
    parts,
    saved: false,
  });
};

export const isPartDifferent = (ctx, partId, contextData) =>
  isPartDifferentRaw(ctx.parts[partId], contextData);

export const getPartTitle = (ctx, partId) =>
  getPartTitleRaw(ctx.parts[partId]);

export const contextFunctions = {
  addPart,
  getPartTitle,
  isOpen,
  isPartDifferent,
  loadPartIntoContext,
  loadProject,
  movePart,
  needSave,
  newProject,
  savePartFromContext,
  saveProject,
  deletePart,
};
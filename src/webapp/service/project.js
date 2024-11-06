import {printStory} from "../api/printer.js";
import {
  listExisting as apiListExisting,
  loadProject as apiLoadProject,
  saveProject as apiSaveProject,
} from "../api/project.js";

import {exportProject as subExport} from "./project/export.js";
import {
  buildNew as buildNewPart,
  loadIntoContext as loadPartIntoContextRaw,
  saveFromContext as savePartFromContextRaw,
  isDifferent as isPartDifferentRaw,
  getTitle as getPartTitleRaw,
  exportPart as partExportPart,
} from "./project/part.js";

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
  ctx.setContext({
    parts: [],
    saved: false,
    title: projectSettings.title,
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
  projectCtx.setContext({
    parts: projectData.parts,
    saved: true,
    title: projectData.title,
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
export const loadProject = async (ctx, projectName) => {
  const projectData = await apiLoadProject(projectName);
  if (projectData.version === undefined) throw new Error("Missing project version");
  switch (projectData.version) {
    case 1:
      return loadProjectV1(ctx, projectData);
    default:
      throw new Error("Unsupported project version");
  }
};

/** Perform a save regardless of the project state */
const realSaveProject = async (projectCtx) => {
  const projectData = {parts: projectCtx.parts, title: projectCtx.title, version: 1};
  await apiSaveProject(projectCtx.title, projectData);
  projectCtx.setContext({saved: true});
};

/** Save the current project
 *
 * Bound to context.
 *
 * @return {Promise}
 * Resolve when saved
 */
export const saveProject = async (ctx) => {
  const haveToSave = await ctx.needSave();
  if (haveToSave) return realSaveProject(ctx);
};

/** Determine if the project need saving
 *
 * Bound to context
 *
 * @return {bool}
 * true if the project need saving
 */
export const needSave = (ctx) => ctx.isOpen() && ctx.saved === false;

/** Check if a project is open
 *
 * Bound to context.
 *
 * @return {bool}
 * true if a project is open
 */
export const isOpen = (ctx) => ctx.title !== null;

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
  ctx.setContext({
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
  ctx.setContext({
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
  ctx.setContext({parts, saved: false});
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
export const loadPartIntoContext = (ctx, partId) => loadPartIntoContextRaw(ctx.parts[partId]);

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
  ctx.setContext({
    parts,
    saved: false,
  });
};

export const exportPart = (ctx, partId) => partExportPart(ctx.parts[partId]);

export const isPartDifferent = (ctx, partId, contextData) =>
  isPartDifferentRaw(ctx.parts[partId], contextData);

export const getPartTitle = (ctx, partId) => getPartTitleRaw(ctx.parts[partId]);

export const exportProject = (ctx) => subExport(ctx);

export const printVariant = (ctx, parameters) => {
  const paragraphs = parameters.selections.map(
    (variantId, chapterId) => ctx.parts[chapterId].variants[variantId],
  );
  return printStory(paragraphs);
};

export const contextFunctions = {
  addPart,
  deletePart,
  exportPart,
  exportProject,
  getPartTitle,
  isOpen,
  isPartDifferent,
  loadPartIntoContext,
  loadProject,
  movePart,
  needSave,
  newProject,
  printVariant,
  savePartFromContext,
  saveProject,
};

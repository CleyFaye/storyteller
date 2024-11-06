import {notificationEnum} from "./notification.js";

/** Handle one save action
 *
 * Will either save the current editors (if needed), or the project (if needed).
 *
 * @param {Object} projectCtx
 * @param {Object} saveCtx
 * @param {Object} notificationCtx
 *
 * @return {Promise}
 */
export const save = async (projectCtx, saveCtx, notificationCtx) => {
  if (saveCtx.needSave) return saveCtx.save();
  try {
    await projectCtx.saveProject();
    notificationCtx.show(notificationEnum.saveSuccess);
  } catch {
    notificationCtx.show(notificationEnum.saveFailure);
  }
};

/** Call the designated action
 *
 * @return {Promise}
 */
export const dispatch = (actionName, projectCtx, saveCtx, notificationCtx) => {
  switch (actionName) {
    case "save":
      return save(projectCtx, saveCtx, notificationCtx);
    default:
      throw new Error(`Unknown action "${actionName}"`);
  }
};

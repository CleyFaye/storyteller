/** Return a JSON-serializable object for the exported project
 *
 * @return {Promise}
 */
export const exportProject = (projectCtx) =>
  new Promise((resolve) => {
    const result = {};
    result.magicVersion = 2;
    result.title = projectCtx.title;
    result.parts = projectCtx.parts.map((_, id) => projectCtx.exportPart(id));
    resolve(result);
  });

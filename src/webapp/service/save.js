/** Add an editor to the stack of watched editors.
 *
 * Usually a component will register itself as an editor in the
 * componentDidMount() method and unregister in the componentWillUnmount()
 * method.
 *
 * Registered editors must have the following two functions available:
 * - needSave(): bool
 * - doSave(): Promise
 *
 * Registered editors must also call "updateSaveState()" when they update.
 *
 * @return {Promise}
 */
export const registerEditor = (ctx, editor) => {
  const activeEditors = ctx.activeEditors.slice();
  activeEditors.push(editor);
  return ctx.update({activeEditors});
};

/** Unregister an editor.
 *
 * @return {Promise}
 */
export const unregisterEditor = (ctx, editor) => {
  const activeEditors = ctx.activeEditors.slice();
  activeEditors.splice(activeEditors.indexOf(editor), 1);
  return ctx.update({activeEditors});
};

/** Perform a save on all editors that need saving
 *
 * @return {Promise}
 */
export const save = (ctx) =>
  Promise.all(
    ctx.activeEditors.reduce((acc, cur) => {
      if (cur.needSave()) {
        acc.push(cur.doSave());
      }
      return acc;
    }, []),
  );

/** Update the "save" status for all editors */
export const updateSaveState = (ctx) => {
  const needSave = ctx.activeEditors.reduce((acc, cur) => acc || cur.needSave(), false);
  if (needSave !== ctx.needSave) {
    return ctx.update({needSave});
  }
  return Promise.resolve();
};

export const contextFunctions = {
  registerEditor,
  save,
  unregisterEditor,
  updateSaveState,
};

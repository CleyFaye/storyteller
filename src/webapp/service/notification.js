export const notificationEnum = {
  loadFailure: {
    id: Symbol("LOADFAILURE"),
    label: "Error when loading project",
  },
  loadSuccess: {
    id: Symbol("LOADSUCCESS"),
    label: "Project loaded",
  },
  networkReadError: {
    id: Symbol("NETREADERROR"),
    label: "An error occured while retrieving data",
  },
  partSaved: {
    id: Symbol("PARTSAVED"),
    label: "Current part saved",
  },
  saveBeforePlay: {
    id: Symbol("SAVEBEFOREPLAY"),
    label: "You need to save before",
  },
  saveFailure: {
    id: Symbol("SAVEFAILURE"),
    label: "Error when saving project",
  },
  saveSuccess: {
    id: Symbol("SAVESUCCESS"),
    label: "Saved project",
  },
  testPrint: {
    id: Symbol("NOTIFICATIONENUM"),
    label: "Test page sent to printer",
  },
};

/** Show a notification based on its id.
 *
 * Context bound function.
 */
export const show = (ctx, enumValue) =>
  Object.keys(notificationEnum).forEach((key) => {
    if (notificationEnum[key].id === enumValue.id) {
      ctx.update({[key]: true});
    }
  });

/** Functions bound to a context */
export const contextFunctions = {
  show,
};

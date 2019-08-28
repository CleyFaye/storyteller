export const notificationEnum = {
  saveSuccess: {
    id: Symbol("SAVESUCCESS"),
    label: "Saved project",
  },
  saveFailure: {
    id: Symbol("SAVEFAILURE"),
    label: "Error when saving project",
  },
  networkReadError: {
    id: Symbol("NETREADERROR"),
    label: "An error occured while retrieving data",
  },
  loadSuccess: {
    id: Symbol("LOADSUCCESS"),
    label: "Project loaded",
  },
  loadFailure: {
    id: Symbol("LOADFAILURE"),
    label: "Error when loading project",
  },
  partSaved: {
    id: Symbol("PARTSAVED"),
    label: "Current part saved",
  },
  saveBeforePlay: {
    id: Symbol("SAVEBEFOREPLAY"),
    label: "You need to save before",
  }
};

/** Show a notification based on its id.
 * 
 * Context bound function.
 */
export const show = (ctx, enumValue) =>
  Object.keys(notificationEnum).forEach(key => {
    if (notificationEnum[key].id == enumValue.id) {
      ctx.update({[key]: true});
    }
  });

/** Functions bound to a context */
export const contextFunctions = {
  show,
};
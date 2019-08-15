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
};

/** Show a notification based on its id */
export const show = (notificationCtx, enumValue) =>
  Object.keys(notificationEnum).forEach(key => {
    if (notificationEnum[key].id == enumValue.id) {
      notificationCtx.update({[key]: true});
    }
  });
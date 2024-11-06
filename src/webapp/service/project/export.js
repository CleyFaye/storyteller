import {magicVersion2} from "../setting.js";

/** Return a JSON-serializable object for the exported project */
export const exportProject = (projectCtx) => ({
  magicVersion: magicVersion2,
  parts: projectCtx.parts.map((_, id) => projectCtx.exportPart(id)),
  title: projectCtx.title,
});

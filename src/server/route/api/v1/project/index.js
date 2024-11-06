import express from "express";

import listExisting from "./listexisting.js";
import loadProject from "./loadproject.js";
import saveProject from "./saveproject.js";

const router = express.Router();

router.use("/listExisting", listExisting);
router.use("/loadProject", loadProject);
router.use("/saveProject", saveProject);

export default router;

import express from "express";
import listExisting from "./listexisting";
import loadProject from "./loadproject";
import saveProject from "./saveproject";

const router = express.Router();

router.use("/listExisting", listExisting);
router.use("/loadProject", loadProject);
router.use("/saveProject", saveProject);

export default router;
import express from "express";
import {APIHandler} from "../../../../util/promise";
import {loadProject} from "../../../../service/project";

const router = express.Router();

const root = req => loadProject(req.query.projectName);
router.get("/", APIHandler(root));

export default router;
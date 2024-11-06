import express from "express";

import {loadProject} from "../../../../service/project.js";
import {APIHandler} from "../../../../util/promise.js";

const router = express.Router();

const root = (req) => loadProject(req.query.projectName);
router.get("/", APIHandler(root));

export default router;

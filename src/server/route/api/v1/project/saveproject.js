import express from "express";

import {saveProject} from "../../../../service/project.js";
import {APIHandler} from "../../../../util/promise.js";

const router = express.Router();

const root = (req) => saveProject(req.body.projectName, req.body.projectData);
router.put("/", APIHandler(root));

export default router;

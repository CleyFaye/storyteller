import express from "express";
import {APIHandler} from "../../../../util/promise";
import {saveProject} from "../../../../service/project";

const router = express.Router();

const root = req => saveProject(req.body.projectName, req.body.projectData);
router.put("/", APIHandler(root));

export default router;
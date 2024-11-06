import express from "express";

import {listExisting} from "../../../../service/project.js";
import {APIHandler} from "../../../../util/promise.js";

const router = express.Router();

const root = () => listExisting();
router.get("/", APIHandler(root));

export default router;

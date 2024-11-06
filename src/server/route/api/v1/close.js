import express from "express";

import {closeServer} from "../../../util/close.js";
import {APIHandler} from "../../../util/promise.js";

const router = express.Router();

const root = () => closeServer();
router.get("/", APIHandler(root));

export default router;

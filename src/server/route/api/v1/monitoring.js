import express from "express";

import {APIHandler} from "../../../util/promise.js";

const router = express.Router();

const root = () => Promise.resolve();
router.get("/", APIHandler(root));

export default router;

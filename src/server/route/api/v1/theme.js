import express from "express";

import {list as listThemes} from "../../../service/theme.js";
import {APIHandler} from "../../../util/promise.js";

const router = express.Router();

const list = () => listThemes();

router.post("/list", APIHandler(list));

export default router;

import express from "express";

import {list as listFonts} from "../../../service/font.js";
import {APIHandler} from "../../../util/promise.js";

const router = express.Router();

const list = () => listFonts();

router.post("/list", APIHandler(list));

export default router;

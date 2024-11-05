import express from "express";
import {APIHandler} from "../../../util/promise";
import {list as listFonts} from "../../../service/font";

const router = express.Router();

const list = () => listFonts();

router.post("/list", APIHandler(list));

export default router;
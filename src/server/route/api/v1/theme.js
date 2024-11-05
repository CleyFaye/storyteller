import express from "express";
import {APIHandler} from "../../../util/promise";
import {list as listThemes} from "../../../service/theme";

const router = express.Router();

const list = () => listThemes();

router.post("/list", APIHandler(list));

export default router;
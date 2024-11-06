import express from "express";

import {getAll, setAll} from "../../../service/setting.js";
import {APIHandler} from "../../../util/promise.js";

const router = express.Router();

const getAllSettings = () => getAll();
const setAllSettings = (req) => setAll(req.body);

router.get("/all", APIHandler(getAllSettings));
router.post("/all", APIHandler(setAllSettings));

export default router;

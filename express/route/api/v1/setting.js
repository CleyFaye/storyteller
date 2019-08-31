import express from "express";
import {APIHandler} from "../../../util/promise";
import {getAll} from "../../../service/setting";
import {setAll} from "../../../service/setting";

const router = express.Router();

const getAllSettings = () => getAll();
const setAllSettings = req => setAll(req.body);

router.get("/all", APIHandler(getAllSettings));
router.post("/all", APIHandler(setAllSettings));

export default router;
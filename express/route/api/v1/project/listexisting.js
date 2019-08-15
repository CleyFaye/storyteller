import express from "express";
import {APIHandler} from "../../../../util/promise";
import {listExisting} from "../../../../service/project";

const router = express.Router();

const root = () => listExisting();
router.get("/", APIHandler(root));

export default router;
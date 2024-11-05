import express from "express";
import {APIHandler} from "../../../util/promise";
import {closeServer} from "../../../util/close";

const router = express.Router();

const root = () => Promise.resolve().then(() => closeServer());
router.get("/", APIHandler(root));

export default router;
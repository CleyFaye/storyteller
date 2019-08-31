import express from "express";
import {APIHandler} from "../../../util/promise";
import {test as testPrinter} from "../../../service/printer";

const router = express.Router();

const test = req => testPrinter(
  req.body.ghostscript,
  req.body.printerName);

router.post("/test", APIHandler(test));

export default router;
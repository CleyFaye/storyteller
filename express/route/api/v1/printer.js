import express from "express";
import {APIHandler} from "../../../util/promise";
import {test as testPrinter} from "../../../service/printer";

const router = express.Router();

const test = req => testPrinter(
  req.body.binPath,
  req.body.printerName,
  req.body.duplex);

router.post("/test", APIHandler(test));

export default router;
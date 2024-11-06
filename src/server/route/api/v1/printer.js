import express from "express";

import {
  test as testPrinter,
  printStory as printerPrintStory,
  list as listPrinters,
} from "../../../service/printer.js";
import {APIHandler} from "../../../util/promise.js";

const router = express.Router();

const test = (req) => testPrinter(req.body.binPath, req.body.printerName, req.body.duplex);

router.post("/test", APIHandler(test));

const printStory = (req) => printerPrintStory(req.body.paragraphs);

router.post("/printStory", APIHandler(printStory));

const list = () => listPrinters();

router.post("/list", APIHandler(list));

export default router;

import express from "express";
import {APIHandler} from "../../../util/promise";
import {test as testPrinter} from "../../../service/printer";
import {printStory as printerPrintStory} from "../../../service/printer";
import {list as listPrinters} from "../../../service/printer";

const router = express.Router();

const test = req => testPrinter(
  req.body.binPath,
  req.body.printerName,
  req.body.duplex);

router.post("/test", APIHandler(test));

const printStory = req => printerPrintStory(req.body.paragraphs);

router.post("/printStory", APIHandler(printStory));

const list = () => listPrinters();

router.post("/list", APIHandler(list));

export default router;
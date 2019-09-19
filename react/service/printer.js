import {test as testPrint} from "../api/printer";
import {list as listPrinters} from "../api/printer";

export const test = (binPath, printerName, duplex) =>
  testPrint(binPath, printerName, duplex);

export const list = () =>
  listPrinters();
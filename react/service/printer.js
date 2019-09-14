import {test as testPrint} from "../api/printer";

export const test = (binPath, printerName, duplex) =>
  testPrint(binPath, printerName, duplex);
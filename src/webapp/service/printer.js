import {test as testPrint, list as listPrinters} from "../api/printer.js";

export const test = (binPath, printerName, duplex) => testPrint(binPath, printerName, duplex);

export const list = () => listPrinters();

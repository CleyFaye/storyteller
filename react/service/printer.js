import {test as testPrint} from "../api/printer";

export const test = (ghostscript, printerName) =>
  testPrint(ghostscript, printerName);
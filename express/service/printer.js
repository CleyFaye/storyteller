import os from "os";
import {pathExists} from "fs-extra";
import {spawn} from "child_process";
import {makePDF} from "./pdf";

const dummyPDFPath = "dummy.pdf";

/** Create the test PDF */
const makeTestPDF = () => makePDF([
  "This is a test page",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac quam lectus. Phasellus ornare sagittis nulla, id faucibus elit ornare non. Morbi massa lacus, pellentesque sed euismod quis, pharetra quis arcu. Sed et euismod erat. Maecenas vehicula eu purus sed hendrerit. Sed pharetra finibus lacus, in sagittis neque laoreet at. Pellentesque sem ante, cursus nec urna vitae, ultrices viverra enim. Integer consectetur euismod eros, a aliquam ex volutpat id. Praesent at enim elit. Nullam non ultricies turpis. Nam commodo vitae turpis non lobortis.",
  "Duis eu mattis sapien. Phasellus felis elit, efficitur eu ante a, venenatis ornare metus. Mauris a odio eu purus dapibus tincidunt. Nullam laoreet libero in lorem placerat, nec iaculis lacus sagittis. Phasellus dolor nibh, faucibus eu elit vitae, finibus blandit ligula. Nullam ac ipsum ullamcorper, vestibulum nibh sed, hendrerit nulla. Nulla commodo erat ex, ac commodo arcu fermentum nec. Donec sit amet tincidunt mi, ac tincidunt orci. Donec vitae purus suscipit neque facilisis dignissim. Nunc venenatis erat a ligula placerat, vulputate suscipit quam vehicula. Sed facilisis ipsum nec lacus congue dapibus nec ac mauris. Aliquam nec ornare odio, nec luctus elit. Nulla semper non lacus non auctor. Nunc at massa quam.",
  "Nullam eu efficitur velit. Donec eu nisi in quam ultrices dignissim in vel augue. Pellentesque sollicitudin libero dolor, nec interdum sem maximus vel. In nec ex velit. Nullam placerat porttitor rhoncus. Quisque id sodales sapien. In ullamcorper leo ut tristique varius. In egestas, dui in cursus egestas, dui odio rhoncus libero, a sollicitudin mi augue ut nulla.",
  "Etiam elementum felis tortor, nec maximus elit tincidunt eget. Praesent ac tristique velit. Nullam pretium maximus volutpat. Etiam vestibulum, risus quis tincidunt molestie, turpis est tincidunt lacus, nec fringilla diam nunc non lectus. Mauris vel hendrerit risus. Fusce justo magna, laoreet et faucibus feugiat, hendrerit eget nulla. Donec purus arcu, sodales ac ligula id, cursus semper justo. Maecenas aliquet dui ac euismod eleifend. Sed vel bibendum enim. Fusce aliquam blandit mi, ac dignissim lacus elementum quis. Maecenas egestas ultricies ipsum, eget vestibulum nisi molestie at. Nunc venenatis felis in dui porta convallis eget id nulla. Maecenas fermentum urna et est scelerisque, in posuere augue porttitor. Curabitur congue tellus eget velit fringilla, id eleifend ipsum faucibus.",
  "Proin vel ultrices quam. Sed sed enim orci. Suspendisse tempor consequat magna, vitae sollicitudin odio semper sagittis. Suspendisse iaculis neque ut dignissim mollis. Morbi iaculis auctor orci sagittis laoreet. Duis euismod vestibulum magna ut porttitor. Praesent eu libero consectetur, maximus mi eu, convallis erat. Vestibulum tristique consequat elit fringilla maximus. Nam turpis sapien, feugiat nec lobortis at, scelerisque in purus. Pellentesque id libero interdum, tempus mi vel, dapibus lectus.",
],
dummyPDFPath);

/** Return the path to the test PDF */
const getTestPDF = () => pathExists(dummyPDFPath)
  .then(exists => {
    if (exists) {
      return dummyPDFPath;
    }
    return makeTestPDF().then(() => dummyPDFPath);
  });

const printPDF = (gsPath, pdfPath, printerName) => new Promise(
  (resolve, reject) => {
    const processToSpawn = os.platform() == "win32"
      ? {
        bin: gsPath,
        args: [
          "-sDEVICE=mswinpr2",
          "-dBATCH",
          "-dNOPAUSE",
          `-sOutputFile=%printer%${printerName}`,
          pdfPath
        ]
      }
      : {
        bin: "lp",
        args: [
          `-d ${printerName}`,
          pdfPath,
        ]
      };
    console.log(processToSpawn);
    const process = spawn(processToSpawn.bin, processToSpawn.args);
    process.stdout.on("data", data => console.log(`[out] print: ${data}`));
    process.stderr.on("data", data => console.log(`[err] print: ${data}`));
    process.on("close", code => {
      if (code == 0) {
        resolve();
      } else {
        reject(new Error("Error while printing"));
      }
    });
  }
);

export const test = (ghostscript, printerName) => Promise.resolve()
  .then(() => Promise.all([
    new Promise(resolve => {
      if (!printerName) {
        throw new Error("No printer name");
      }
      resolve(printerName);
    }),
    ghostscript,
    getTestPDF(),
  ]).then(([printerName, gsPath, pdfPath]) => {
    return printPDF(gsPath, pdfPath, printerName);
  })
  );
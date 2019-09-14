import {writeFile} from "fs-extra";
import {PDFDocument} from "pdf-lib";
import {StandardFonts} from "pdf-lib";
import {PageSizes} from "pdf-lib";
import {rgb} from "pdf-lib";

const pointToIn = value => value / 72;
const inToMM = value => value * 25.4;
const pointToMM = value => inToMM(pointToIn(value));
const mmToIn = value => value / 25.4;
const inToPoint = value => value * 72;
const mmToPoint = value => inToPoint(mmToIn(value));

/** Aggregate all paragraphs into lines */
const paragraphsToLines = paragraphs =>
  paragraphs.reduce((acc, cur) => {
    if (acc.length > 0) {
      acc.push("");
    }
    acc.push(cur);
    return acc;
  },
  []);

/** Return the width of a series of words */
const wordsWidth = (words, font, size) => {
  const line = words.join(" ");
  return font.widthOfTextAtSize(line, size);
};

/** Cut a single line to the given width
 * 
 * @return {string[]}
 */
const cutLineToWidth = (line, width, font, size) => {
  const result = [];
  const words = line.split(" ");
  const candidateWords = [];
  while (words.length > 0) {
    candidateWords.push(words[0]);
    words.splice(0, 1);
    const lineWidth = wordsWidth(candidateWords, font, size);
    if (lineWidth > width) {
      // Candidate line is too long, what to do
      if (candidateWords.length == 1) {
        // Only one word but we're over budget; add it anyway
        result.push(candidateWords.join(" "));
      } else {
        // One too many word, remove the last one
        words.splice(0, 0, candidateWords.pop());
        result.push(candidateWords.join(" "));
      }
      candidateWords.length = 0;
    }
  }
  if (candidateWords.length > 0) {
    result.push(candidateWords.join(" "));
  }
  if (result.length == 0) {
    return [""];
  }
  return result;
};

const filterNewLinesInLines = lines => {
  const result = [];
  lines.forEach(line => {
    const splittedLine = line.replace(/\r/g, "").split("\n");
    splittedLine.forEach(cutLine => result.push(cutLine));
  });
  return result;
};

/** Return individual lines constrained to the given width */
const cutLines = (lines, width, font, size) => {
  lines = filterNewLinesInLines(lines);
  const splitLines = lines.map(line => cutLineToWidth(line, width, font, size));
  return splitLines.reduce((acc, cur) => {
    return acc.concat(cur);
  }, []);
};

export const makePDF = (paragraphs, outputPath) => {
  let pdfDoc;
  let timesRomanFont;
  return PDFDocument.create()
    .then(res => pdfDoc = res)
    .then(() => pdfDoc.embedFont(StandardFonts.TimesRoman))
    .then(res => timesRomanFont = res)
    .then(() => {
      let yOffset = 0;
      let currentPage = pdfDoc.addPage(PageSizes.A4);

      const {width, height} = currentPage.getSize();
      const horizontalMargin = mmToPoint(20);
      const verticalMargin = mmToPoint(20);
      const workWidth = width - 2 * horizontalMargin;
      const workHeight = height - 2 * verticalMargin;

      const fontSize = 14;
      const lineHeight = timesRomanFont.heightAtSize(fontSize) * 1.15;

      const lines = cutLines(
        paragraphsToLines(paragraphs),
        workWidth,
        timesRomanFont,
        fontSize);

      lines.forEach(line => {
        const remainingHeight = workHeight - yOffset;
        if (remainingHeight < lineHeight) {
          currentPage = pdfDoc.addPage(PageSizes.A4);
          yOffset = 0;
        }
        currentPage.drawText(line, {
          x: horizontalMargin,
          y: workHeight + verticalMargin - yOffset,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        yOffset += lineHeight;
      });
      return pdfDoc.save();
    }).then(pdfBytes => writeFile(outputPath, pdfBytes));
};
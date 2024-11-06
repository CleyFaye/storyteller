import {writeFile} from "fs-extra";
import {PDFDocument, StandardFonts, PageSizes, rgb} from "pdf-lib";

import {getAll} from "./setting.js";

/* eslint-disable no-magic-numbers */
const mmToIn = (value) => value / 25.4;
const inToPoint = (value) => value * 72;
const mmToPoint = (value) => inToPoint(mmToIn(value));
/* eslint-enable no-magic-numbers */

/** Aggregate all paragraphs into lines */
const paragraphsToLines = (paragraphs) =>
  paragraphs.reduce((acc, cur) => {
    if (acc.length > 0) {
      acc.push("");
    }
    acc.push(cur);
    return acc;
  }, []);

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
      if (candidateWords.length === 1) {
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
  if (result.length === 0) {
    return [""];
  }
  return result;
};

const filterNewLinesInLines = (lines) => {
  const result = [];
  lines.forEach((line) => {
    const splittedLine = line.replace(/\r/gu, "").split("\n");
    splittedLine.forEach((cutLine) => result.push(cutLine));
  });
  return result;
};

/** Return individual lines constrained to the given width */
const cutLines = (linesIn, width, font, size) => {
  const lines = filterNewLinesInLines(linesIn);
  const splitLines = lines.map((line) => cutLineToWidth(line, width, font, size));
  return splitLines.reduce((acc, cur) => acc.concat(cur), []);
};

const getFontRealName = (font, bold, italic) => {
  switch (font) {
    case "Courier":
      if (bold && italic) {
        return StandardFonts.CourierBoldOblique;
      }
      if (bold) {
        return StandardFonts.CourierBold;
      }
      if (italic) {
        return StandardFonts.CourierOblique;
      }
      return StandardFonts.Courier;
    case "Helvetica":
      if (bold && italic) {
        return StandardFonts.HelveticaBoldOblique;
      }
      if (bold) {
        return StandardFonts.HelveticaBold;
      }
      if (italic) {
        return StandardFonts.HelveticaOblique;
      }
      return StandardFonts.Helvetica;
    case "TimesRoman":
      if (bold && italic) {
        return StandardFonts.TimesRomanBoldItalic;
      }
      if (bold) {
        return StandardFonts.TimesRomanBold;
      }
      if (italic) {
        return StandardFonts.TimesRomanItalic;
      }
  }
  return StandardFonts.TimesRoman;
};

const getFontFromSettings = async () => {
  const {pdfFont, pdfFontBold, pdfFontItalic, pdfFontSize} = await getAll();
  const finalNameRef = getFontRealName(pdfFont, pdfFontBold, pdfFontItalic);
  return {
    name: finalNameRef,
    size: pdfFontSize,
  };
};

export const makePDF = async (paragraphs, outputPath) => {
  const pdfDoc = await PDFDocument.create();
  const {name: fontName, size: fontSize} = await getFontFromSettings();
  const fontObj = await pdfDoc.embedFont(fontName);
  let yOffset = 0;
  let currentPage = pdfDoc.addPage(PageSizes.A4);

  const {width, height} = currentPage.getSize();
  const baseMargin = 20;
  const horizontalMargin = mmToPoint(baseMargin);
  const verticalMargin = mmToPoint(baseMargin);
  const workWidth = width - horizontalMargin - horizontalMargin;
  const workHeight = height - verticalMargin - verticalMargin;

  const baseFontScale = 1.15;
  const lineHeight = fontObj.heightAtSize(fontSize) * baseFontScale;

  const lines = cutLines(paragraphsToLines(paragraphs), workWidth, fontObj, fontSize);

  lines.forEach((line) => {
    const remainingHeight = workHeight - yOffset;
    if (remainingHeight < lineHeight) {
      currentPage = pdfDoc.addPage(PageSizes.A4);
      yOffset = 0;
    }
    currentPage.drawText(line, {
      color: rgb(0, 0, 0),
      font: fontObj,
      size: fontSize,
      x: horizontalMargin,
      y: workHeight + verticalMargin - yOffset,
    });
    yOffset += lineHeight;
  });
  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
};

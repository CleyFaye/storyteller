import {readJSON} from "fs-extra";
import {writeJSON} from "fs-extra";

const configPath = "./settings.json";

const loadConfig = () => readJSON(configPath)
  .catch(() => ({}))
  .then(fileConfig => Object.assign(
    {
      printerName: "",
      binPath: "",
      duplex: true,
      theme: "steamy",
      uiScale: 20,
      pdfFont: "TimesRoman",
      pdfFontBold: false,
      pdfFontItalic: false,
      pdfFontSize: 14,
    },
    fileConfig
  ));

const saveConfig = settings => loadConfig()
  .then(
    initialConfig => Object.assign(
      initialConfig,
      settings
    )
  ).then(finalConfig => writeJSON(configPath, finalConfig));

export const getAll = () => loadConfig();
export const setAll = settings => saveConfig(settings);
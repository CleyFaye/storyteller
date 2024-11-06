import {readJSON, writeJSON} from "./io.js";

const configPath = "./settings.json";

const defaultConfig = {
  binPath: "",
  duplex: true,
  pdfFont: "TimesRoman",
  pdfFontBold: false,
  pdfFontItalic: false,
  pdfFontSize: 14,
  printerName: "",
  theme: "steamy",
  uiScale: 20,
};

const loadConfig = async () => {
  try {
    const config = await readJSON(configPath);
    return {...defaultConfig, ...config};
  } catch {
    return {...defaultConfig};
  }
};

const saveConfig = async (settings) => {
  const initialConfig = await loadConfig();
  const finalConfig = {...initialConfig, ...settings};
  await writeJSON(configPath, finalConfig);
};

export const getAll = () => loadConfig();
export const setAll = (settings) => saveConfig(settings);

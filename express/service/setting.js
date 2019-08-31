import {readJSON} from "fs-extra";
import {writeJSON} from "fs-extra";

const configPath = "./settings.json";

const loadConfig = () => readJSON(configPath)
  .catch(() => ({}))
  .then(fileConfig => Object.assign(
    {
      printerName: "",
      ghostscript: "",
    },
    fileConfig
  ));

const saveConfig = settings => writeJSON(configPath, settings);

export const getAll = () => loadConfig();
export const setAll = settings => saveConfig(settings);
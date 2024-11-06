import {getAll as getAllSettings, setAll as setAllSettings} from "../api/setting.js";

export const getAll = () => getAllSettings();
export const setAll = (settings) => setAllSettings(settings);

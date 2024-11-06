import {getAll as getAllSettings, setAll as setAllSettings} from "../api/setting.js";

export const magicVersion1 = 1;
export const magicVersion2 = 2;

export const getAll = () => getAllSettings();
export const setAll = (settings) => setAllSettings(settings);

import {getAll as getAllSettings} from "../api/setting";
import {setAll as setAllSettings} from "../api/setting";

export const getAll = () => getAllSettings();
export const setAll = settings => setAllSettings(settings);
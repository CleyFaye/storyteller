import {createHash} from "node:crypto";
import {existsSync} from "node:fs";
import {join} from "node:path";

import {APIError, errorCodes} from "../util/api.js";

import {ensureDir, readJSON, writeJSON} from "./io.js";

const dataPath = "data";
const listingFile = "listing.json";
const listingFilePath = join(dataPath, listingFile);

/** Convert a project name to a file name */
const getFilenameForProject = (projectName) => {
  const hash = createHash("sha256");
  hash.update(projectName);
  return join(dataPath, hash.digest("hex"));
};

/** Make sure the data directory exist */
const prepareDataDir = () => ensureDir(dataPath);

/** Read the list of projects from the local DB.
 *
 * @return {Promise<string[]>}
 */
const getDB = async () => {
  const listingExist = existsSync(listingFilePath);
  if (!listingExist) return [];
  return await readJSON(listingFilePath);
};

/** Add a project to the DB (if not already present) */
const addToDB = async (projectName) => {
  const db = await getDB();
  if (!db.includes(projectName)) {
    db.push(projectName);
    await prepareDataDir();
    await writeJSON(listingFilePath, db);
  }
};

/** List all known projects */
export const listExisting = () => getDB();

/** Open data for an existing project */
export const loadProject = async (projectName) => {
  const filename = getFilenameForProject(projectName);
  const fileExist = existsSync(filename);
  if (!fileExist) {
    throw APIError(errorCodes.PROJECT_ENOENT, "Project file not found");
  }
  return await readJSON(filename);
};

/** Save data for a project */
export const saveProject = async (projectName, projectData) => {
  await prepareDataDir();
  const filename = getFilenameForProject(projectName);
  await writeJSON(filename, projectData);
  await addToDB(projectName);
};

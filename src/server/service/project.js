import {createHash} from "node:crypto";
import {join} from "node:path";

import {readJSON, writeJSON, ensureDir, pathExists} from "fs-extra";

import {APIError, errorCodes} from "../util/api.js";

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
  const listingExist = await pathExists(listingFilePath);
  if (!listingExist) return [];
  return readJSON(listingFilePath);
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
  const fileExist = await pathExists(filename);
  if (!fileExist) {
    throw APIError(errorCodes.PROJECT_ENOENT, "Project file not found");
  }
  return readJSON(filename);
};

/** Save data for a project */
export const saveProject = async (projectName, projectData) => {
  await prepareDataDir();
  const filename = getFilenameForProject(projectName);
  await writeJSON(filename, projectData);
  await addToDB(projectName);
};

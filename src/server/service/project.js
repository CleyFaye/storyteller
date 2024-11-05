import {join} from "path";
import {readJSON} from "fs-extra";
import {writeJSON} from "fs-extra";
import {ensureDir} from "fs-extra";
import {pathExists} from "fs-extra";
import {createHash} from "crypto";
import {APIError} from "../util/api";
import {errorCodes} from "../util/api";

const dataPath = "data";
const listingFile = "listing.json";
const listingFilePath = join(dataPath, listingFile);

/** Convert a project name to a file name
 * 
 * @return {Promise<string>}
 * The filename
 */
const getFilenameForProject = projectName => new Promise(resolve => {
  const hash = createHash("sha256");
  hash.update(projectName);
  resolve(join(dataPath, hash.digest("hex")));
});

/** Make sure the data directory exist */
const prepareDataDir = () => ensureDir(dataPath);

/** Read the list of projects from the local DB.
 * 
 * @return {Promise<string[]>}
 */
const getDB = () => pathExists(listingFilePath)
  .then(
    listingExist => {
      if (!listingExist) {
        return [];
      }
      return readJSON(listingFilePath);
    }
  );

/** Add a project to the DB (if not already present) */
const addToDB = projectName => getDB()
  .then(db => {
    if (!db.includes(projectName)) {
      db.push(projectName);
      return prepareDataDir().then(() => writeJSON(listingFilePath, db));
    }
  });

/** List all known projects */
export const listExisting = () => getDB();

/** Open data for an existing project */
export const loadProject = projectName => {
  let filename;
  return getFilenameForProject(projectName)
    .then(res => filename = res)
    .then(() => pathExists(filename))
    .then(fileExist => {
      if (!fileExist) {
        throw APIError(errorCodes.PROJECT_ENOENT, "Project file not found");
      }
    })
    .then(() => readJSON(filename));
};


/** Save data for a project */
export const saveProject = (projectName, projectData) =>
  prepareDataDir()
    .then(() => getFilenameForProject(projectName))
    .then(filename => writeJSON(filename, projectData))
    .then(() => addToDB(projectName));
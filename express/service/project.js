import {join} from "path";
import {readJSON} from "fs-extra";
import {pathExists} from "fs-extra";

const dataPath = "data";
const listingFile = "listing.json";
const listingFilePath = join(dataPath, listingFile);

/** List all known projects */
export const listExisting = () => pathExists(listingFilePath)
  .then(
    listingExist => {
      if (!listingExist) {
        return [];
      }
      return readJSON(listingFilePath);
    }
  );
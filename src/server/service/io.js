import * as fs from "node:fs/promises";

export const ensureDir = async (dir) => {
  await fs.mkdir(dir, {recursive: true});
};

export const readJSON = async (filepath) => {
  const content = await fs.readFile(filepath, "utf8");
  return JSON.parse(content);
};

export const writeJSON = async (filepath, data) => {
  await fs.writeFile(filepath, JSON.stringify(data));
};

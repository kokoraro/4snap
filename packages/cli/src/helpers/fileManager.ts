import fs from "fs";

export function directoryExists(directoryName: string) {
  const directoryPath = `${process.cwd()}/${directoryName}`;
  try {
    return fs.statSync(directoryPath).isDirectory();
  } catch (error) {
    return false;
  }
}

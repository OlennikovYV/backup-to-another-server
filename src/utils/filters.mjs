import {
  getFileCreationTime,
  getFileExtension,
  changeExtension,
  pathExists,
  getFullPath,
} from "./file.mjs";

export function isFileTimeNotExpired(fileName, expirationInDays) {
  const nowDate = new Date();
  const fileTime = getFileCreationTime(fileName);

  if (!fileTime) return false;
  const diffDate = new Date(nowDate).getTime() - new Date(fileTime).getTime();
  const diffDay = Math.ceil(diffDate / (1000 * 3600 * 24));
  if (diffDay > expirationInDays) return false;
  return true;
}

export function isFileExtension(fileName, extension) {
  return getFileExtension(fileName) === extension;
}

export function isExistsArchive(pathDestination, fileName, extensionArchive) {
  const extension = getFileExtension(fileName);
  const nameArchiv = changeExtension(fileName, extension, extensionArchive);
  return pathExists(getFullPath(pathDestination, nameArchiv));
}

export function filterFilesList(fileList, callback) {
  return fileList.filter((fileName) => callback(fileName));
}

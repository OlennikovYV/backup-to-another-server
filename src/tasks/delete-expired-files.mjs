import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";

export function deleteExpiredFiles(pathSource, expirationInDays) {
  logFile.writeMessage("Garbage.", logFile.TYPE_MESSAGE_SYST);

  if (!file.fileExists(pathSource)) {
    logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    return;
  }

  const sourceFileList = file.getFilesListFromPath(pathSource);

  const filterFilesList = sourceFileList.filter((el) => {
    const fullName = file.getFullPath(pathSource, el);
    const fileTime = file.getFileCreationDate(fullName);

    if (!fileTime) return false;

    const ageFile = new Date() - new Date(fileTime);
    return (
      new Date(ageFile).getDate() > expirationInDays &&
      (file.getFileExtension(fullName) === ".bak" ||
        file.getFileExtension(fullName) === ".gz")
    );
  });

  filterFilesList.forEach((fileName) => {
    const fullName = file.getFullPath(pathSource, fileName);
    if (file.fileExists(fullName)) file.deleteFile(fullName);
  });

  logFile.writeMessage("Garbage.", logFile.TYPE_MESSAGE_SYST);
}

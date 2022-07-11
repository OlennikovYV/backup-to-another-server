import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";

export function zippedFiles(pathDestination, expirationInDays) {
  logFile.writeMessage("Zipped.", logFile.TYPE_MESSAGE_SYST);

  if (!file.fileExists(pathDestination)) {
    logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    return;
  }

  const srcFileList = file.getFilesListFromPath(pathDestination);

  const filterFilesList = srcFileList.filter((fileName) => {
    const fullName = file.getFullPath(pathDestination, fileName);
    const fileTime = file.getFileCreationDate(fullName);

    if (!fileTime) return false;

    const age = new Date() - new Date(fileTime);

    return (
      new Date(age).getDate() <= expirationInDays &&
      file.getFileExtension(fullName) === ".bak"
    );
  });

  if (filterFilesList.length > 0) {
    for (let fileName of filterFilesList) {
      const nameArchiv = file.changeExtension(fileName, ".bak", ".gz");
      const srcFullName = file.getFullPath(pathDestination, fileName);
      const dstFullName = file.getFullPath(pathDestination, nameArchiv);

      // TODO check error
      file.zipFile(srcFullName, dstFullName);
      logFile.writeMessage(`  ${fileName} zipped.`, logFile.TYPE_MESSAGE_INFO);
      file.deleteFile(srcFullName);
      logFile.writeMessage(`  ${fileName} deleted.`, logFile.TYPE_MESSAGE_INFO);
    }
  } else {
    logFile.writeMessage("No files to zipped.", logFile.TYPE_MESSAGE_INFO);
  }

  logFile.writeMessage("Zipped finish.", logFile.TYPE_MESSAGE_SYST);

  return;
}

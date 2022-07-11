import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";

export function copyBackupFiles(pathSource, pathDestination, expirationInDays) {
  logFile.writeMessage("Backup.", logFile.TYPE_MESSAGE_SYST);

  if (!(file.fileExists(pathSource) && file.fileExists(pathDestination))) {
    logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = file.getFilesListFromPath(pathSource);

  const filterFilesList = srcFileList.filter((el) => {
    const srcFullName = file.getFullPath(pathSource, el);
    const fileTime = file.getFileCreationDate(srcFullName);

    if (!fileTime) return false;

    const age = new Date() - new Date(fileTime);

    // TODO add to '.gz' in filter
    return (
      new Date(age).getDate() <= expirationInDays &&
      file.getFileExtension(el) === ".bak" &&
      !file.fileExists(file.getFullPath(pathDestination, el))
    );
  });

  if (filterFilesList.length > 0) {
    for (let fileName of filterFilesList) {
      const srcFullName = file.getFullPath(pathSource, fileName);
      const dstFullName = file.getFullPath(pathDestination, fileName);
      // TODO check error
      file.copyFile(srcFullName, dstFullName);
      logFile.writeMessage(`  ${fileName} copied.`, logFile.TYPE_MESSAGE_INFO);
    }
  } else logFile.writeMessage("No files to copy.", logFile.TYPE_MESSAGE_INFO);

  logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);

  return;
}

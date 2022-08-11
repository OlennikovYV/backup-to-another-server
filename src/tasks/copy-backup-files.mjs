import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";
import * as constants from "../utils/constants.mjs";

export function copyBackupFiles(pathSource, pathDestination, expirationInDays) {
  logFile.writeMessage("Backup.", logFile.TYPE_MESSAGE_SYST);

  if (!(file.fileExists(pathSource) && file.fileExists(pathDestination))) {
    logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = file.getFilesListFromPath(pathSource);

  const filterFilesList = srcFileList.filter((fileName) => {
    return (
      file.isFileTimeNotExpired(
        file.getFullPath(pathSource, fileName),
        expirationInDays
      ) &&
      file.isFileExtension(fileName, constants.extentionBackup) &&
      !file.isExistsArchive(
        pathDestination,
        fileName,
        constants.extentionArchiv
      )
    );
  });

  if (filterFilesList.length > 0) {
    for (let fileName of filterFilesList) {
      const srcFullName = file.getFullPath(pathSource, fileName);
      const dstFullName = file.getFullPath(pathDestination, fileName);

      try {
        file.copyFile(srcFullName, dstFullName);
      } catch (err) {
        logFile.writeMessage(`Unable to ${err.type} file ${err.file}.`);
      }

      logFile.writeMessage(`  ${fileName} copied.`, logFile.TYPE_MESSAGE_INFO);
    }
  } else logFile.writeMessage("  No files to copy.", logFile.TYPE_MESSAGE_INFO);

  logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);
}

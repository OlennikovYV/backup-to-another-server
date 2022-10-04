import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";
import * as constants from "../utils/constants.mjs";

export function zippedFiles(pathDestination, expirationInDays) {
  logFile.writeMessage("Zipped.", logFile.TYPE_MESSAGE_SYST);

  if (!file.pathExists(pathDestination)) {
    logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    logFile.writeMessage("Zipped finish.", logFile.TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = file.getFilesListFromPath(pathDestination);

  const filterFilesList = srcFileList.filter((fileName) => {
    return (
      file.isFileTimeNotExpired(
        file.getFullPath(pathDestination, fileName),
        expirationInDays
      ) && file.isFileExtension(fileName, constants.extentionBackup)
    );
  });

  if (filterFilesList.length > 0) {
    for (let fileName of filterFilesList) {
      const nameArchiv = file.changeExtension(
        fileName,
        constants.extentionBackup,
        constants.extentionArchiv
      );
      const srcFullName = file.getFullPath(pathDestination, fileName);
      const dstFullName = file.getFullPath(pathDestination, nameArchiv);

      try {
        file.zipFileAdm(srcFullName, dstFullName);
        logFile.writeMessage(
          `  ${nameArchiv} zipped.`,
          logFile.TYPE_MESSAGE_INFO
        );
      } catch (err) {
        logFile.writeMessage(
          `Unable to ${err.type} file ${err.file}.`,
          logFile.TYPE_MESSAGE_ERROR
        );
      }

      try {
        file.deleteFile(srcFullName);
        logFile.writeMessage(
          `  ${fileName} deleted.`,
          logFile.TYPE_MESSAGE_INFO
        );
      } catch (err) {
        logFile.writeMessage(
          `Unable to ${err.type} file ${err.file}.`,
          logFile.TYPE_MESSAGE_ERROR
        );
      }
    }
  } else {
    logFile.writeMessage("  No files to zipped.", logFile.TYPE_MESSAGE_INFO);
  }

  logFile.writeMessage("Zipped finish.", logFile.TYPE_MESSAGE_SYST);
}

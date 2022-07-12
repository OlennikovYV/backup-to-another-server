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

  // TODO Put into separate functions
  const filterFilesList = srcFileList.filter((fileName) => {
    let fileTime, nameArchiv, diffDate;

    fileTime = file.getFileCreationDate(file.getFullPath(pathSource, fileName));
    if (!fileTime) return false;

    diffDate = new Date(new Date() - new Date(fileTime)).getDate();
    if (diffDate > expirationInDays) return false;

    if (file.getFileExtension(fileName) !== ".bak") return false;

    nameArchiv = file.changeExtension(fileName, ".bak", ".gz");
    if (file.fileExists(file.getFullPath(pathDestination, nameArchiv)))
      return false;

    return true;
  });

  if (filterFilesList.length > 0) {
    for (let fileName of filterFilesList) {
      const srcFullName = file.getFullPath(pathSource, fileName);
      const dstFullName = file.getFullPath(pathDestination, fileName);

      try {
        file.copyFile(srcFullName, dstFullName);
      } catch (err) {
        if (err.type === "read")
          logFile.writeMessage(`Unable to read file ${err.file}.`);
        if (err.type === "write")
          logFile.writeMessage(`Unable to write file ${err.file}.`);
      }

      logFile.writeMessage(`  ${fileName} copied.`, logFile.TYPE_MESSAGE_INFO);
    }
  } else logFile.writeMessage("  No files to copy.", logFile.TYPE_MESSAGE_INFO);

  logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);
}

import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";

export function deleteExpiredFiles(pathSource, expirationInDays) {
  logFile.writeMessage("Garbage.", logFile.TYPE_MESSAGE_SYST);

  if (!file.fileExists(pathSource)) {
    logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    logFile.writeMessage("Garbage finish.", logFile.TYPE_MESSAGE_SYST);
    return;
  }

  const sourceFileList = file.getFilesListFromPath(pathSource);

  const filterFilesList = sourceFileList.filter((fileName) => {
    return (
      !file.isFileTimeNotExpired(
        file.getFullPath(pathSource, fileName),
        expirationInDays
      ) &&
      (file.isFileExtension(fileName, ".bak") ||
        file.isFileExtension(fileName, ".gz"))
    );
  });

  if (filterFilesList.length > 0) {
    filterFilesList.forEach((fileName) => {
      const fullName = file.getFullPath(pathSource, fileName);

      if (file.fileExists(fullName)) {
        try {
          file.deleteFile(fullName);
          logFile.writeMessage(
            `  ${fileName} deleted.`,
            logFile.TYPE_MESSAGE_INFO
          );
        } catch (err) {
          if (err.type === "delete")
            logFile.writeMessage(`Unable to delete file ${err.file}.`);
        }
      }
    });
  } else
    logFile.writeMessage("  No files to delete.", logFile.TYPE_MESSAGE_INFO);

  logFile.writeMessage("Garbage finish.", logFile.TYPE_MESSAGE_SYST);
}

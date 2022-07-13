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

  const filterFilesList = sourceFileList.filter((el) => {
    const fullName = file.getFullPath(pathSource, el);
    const fileTime = file.getFileCreationTime(fullName);

    if (!fileTime) return false;

    const ageFile = new Date() - new Date(fileTime);
    return (
      new Date(ageFile).getDate() > expirationInDays &&
      (file.getFileExtension(fullName) === ".bak" ||
        file.getFileExtension(fullName) === ".gz")
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
  } else logFile.writeMessage("  No expired files.", logFile.TYPE_MESSAGE_INFO);

  logFile.writeMessage("Garbage finish.", logFile.TYPE_MESSAGE_SYST);
}

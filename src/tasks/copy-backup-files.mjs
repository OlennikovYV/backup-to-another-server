import * as logFile from "../utils/log-file.mjs";
import * as file from "../utils/file.mjs";

export async function copyBackupFiles(
  pathSource,
  pathDestination,
  expirationInDays
) {
  logFile.writeMessage("Backup.", logFile.TYPE_MESSAGE_SYST);

  if (!(file.fileExists(pathSource) && file.fileExists(pathDestination))) {
    await logFile.writeMessage("Incorrect path.", logFile.TYPE_MESSAGE_ERROR);
    await logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);
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
      await file
        .copyFiles(srcFullName, dstFullName)
        .then((res) => {
          logFile.writeMessage(
            `File ${res} copied.`,
            logFile.TYPE_MESSAGE_INFO
          );
          return;
        })
        .catch((error) =>
          logFile.writeMessage(error.message, logFile.TYPE_MESSAGE_ERROR)
        );
    }
  } else logFile.writeMessage("No files to copy.", logFile.TYPE_MESSAGE_INFO);

  logFile.writeMessage("Backup finish.", logFile.TYPE_MESSAGE_SYST);

  return;
}

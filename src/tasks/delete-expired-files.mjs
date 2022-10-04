import {
  TYPE_MESSAGE_SYST,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_INFO,
  writeMessage,
} from "../utils/log-file.mjs";
import {
  pathExists,
  getFilesListFromPath,
  getFullPath,
  deleteFile,
} from "../utils/file.mjs";
import {
  filterFilesList,
  isFileTimeNotExpired,
  isFileExtension,
} from "../utils/filters.mjs";
import {
  pathSource,
  expirationInDays,
  extentionBackup,
  extentionArchiv,
} from "../utils/constants.mjs";

function verifyСonditions(fileName) {
  return (
    !isFileTimeNotExpired(
      getFullPath(pathSource, fileName),
      expirationInDays
    ) &&
    (isFileExtension(fileName, extentionBackup) ||
      isFileExtension(fileName, extentionArchiv))
  );
}

function deleteExpiredFiles(filesList) {
  filesList.forEach((fileName) => {
    const fullName = getFullPath(pathSource, fileName);

    if (pathExists(fullName)) {
      try {
        deleteFile(fullName);
        writeMessage(`  ${fileName} deleted.`, TYPE_MESSAGE_INFO);
      } catch (err) {
        writeMessage(
          `Unable to ${err.type} file ${err.file}.`,
          TYPE_MESSAGE_ERROR
        );
      }
    }
  });
}

export function garbageFiles() {
  writeMessage("Garbage.", TYPE_MESSAGE_SYST);

  if (!pathExists(pathSource)) {
    writeMessage("Incorrect path.", TYPE_MESSAGE_ERROR);
    writeMessage("Garbage finish.", TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = getFilesListFromPath(pathSource);

  const filesList = filterFilesList(srcFileList, verifyСonditions);

  if (filesList.length > 0) {
    deleteExpiredFiles(filesList);
  } else writeMessage("  No files to garbage.", TYPE_MESSAGE_INFO);

  writeMessage("Garbage finish.", TYPE_MESSAGE_SYST);
}

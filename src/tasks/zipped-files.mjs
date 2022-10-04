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
  changeExtension,
  zipFileAdm,
  deleteFile,
} from "../utils/file.mjs";
import {
  isFileTimeNotExpired,
  isFileExtension,
  filterFilesList,
} from "../utils/filters.mjs";
import {
  pathDestination,
  expirationInDays,
  extentionBackup,
  extentionArchiv,
} from "../utils/constants.mjs";

function verifyСonditions(fileName) {
  return (
    isFileTimeNotExpired(
      getFullPath(pathDestination, fileName),
      expirationInDays
    ) && isFileExtension(fileName, extentionBackup)
  );
}

function zippedAndDeletingBackup(filesList) {
  for (let fileName of filesList) {
    const nameArchiv = changeExtension(
      fileName,
      extentionBackup,
      extentionArchiv
    );
    const srcFullName = getFullPath(pathDestination, fileName);
    const dstFullName = getFullPath(pathDestination, nameArchiv);

    try {
      zipFileAdm(srcFullName, dstFullName);
      writeMessage(`  ${nameArchiv} zipped.`, TYPE_MESSAGE_INFO);
    } catch (err) {
      writeMessage(
        `Unable to ${err.type} file ${err.file}.`,
        TYPE_MESSAGE_ERROR
      );
    }

    try {
      deleteFile(srcFullName);
      writeMessage(`  ${fileName} deleted.`, TYPE_MESSAGE_INFO);
    } catch (err) {
      writeMessage(
        `Unable to ${err.type} file ${err.file}.`,
        TYPE_MESSAGE_ERROR
      );
    }
  }
}

export function zippedBackupFiles() {
  writeMessage("Zipped.", TYPE_MESSAGE_SYST);

  if (!pathExists(pathDestination)) {
    writeMessage("Incorrect path.", TYPE_MESSAGE_ERROR);
    writeMessage("Zipped finish.", TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = getFilesListFromPath(pathDestination);
  const filesList = filterFilesList(srcFileList, verifyСonditions);

  if (filesList.length > 0) {
    zippedAndDeletingBackup(filesList);
  } else {
    writeMessage("  No files to zipped.", TYPE_MESSAGE_INFO);
  }

  writeMessage("Zipped finish.", TYPE_MESSAGE_SYST);
}

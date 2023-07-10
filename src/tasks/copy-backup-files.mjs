import {
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SYST,
  TYPE_MESSAGE_INFO,
  writeMessage,
} from "../utils/log-file.mjs";
import {
  getFullPath,
  pathExists,
  getFilesListFromPath,
  copyBigFile,
} from "../utils/file.mjs";
import {
  isFileTimeNotExpired,
  isFileExtension,
  isExistsArchive,
  filterFilesList,
} from "../utils/filters.mjs";
import {
  extentionBackup,
  extentionArchiv,
  pathSource,
  pathDestination,
  expirationInDays,
} from "../utils/constants.mjs";

function verifyСonditions(fileName) {
  return (
    isFileTimeNotExpired(getFullPath(pathSource, fileName), expirationInDays) &&
    isFileExtension(fileName, extentionBackup) &&
    !isExistsArchive(pathDestination, fileName, extentionArchiv)
  );
}

function copyingFilesList(filesList) {
  for (let fileName of filesList) {
    const srcFullName = getFullPath(pathSource, fileName);
    const dstFullName = getFullPath(pathDestination, fileName);

    try {
      copyBigFile(srcFullName, dstFullName);
    } catch (err) {
      writeMessage(
        `'${err.error.code}'. Unable to ${err.type} file ${err.file}.`,
        TYPE_MESSAGE_ERROR
      );
    }

    writeMessage(`  ${fileName} copied.`, TYPE_MESSAGE_INFO);
  }
}

export function copyBackupFiles() {
  writeMessage("Backup.", TYPE_MESSAGE_SYST);

  if (!(pathExists(pathSource) && pathExists(pathDestination))) {
    writeMessage("Incorrect path.", TYPE_MESSAGE_ERROR);
    writeMessage("Backup finish.", TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = getFilesListFromPath(pathSource);
  const filesList = filterFilesList(srcFileList, verifyСonditions);

  if (filesList.length > 0) {
    copyingFilesList(filesList);
  } else writeMessage("  No files to copy.", TYPE_MESSAGE_INFO);

  writeMessage("Backup finish.", TYPE_MESSAGE_SYST);
}

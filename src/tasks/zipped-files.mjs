import {
  TYPE_MESSAGE_SYST,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_INFO,
  writeMessage,
} from "../utils/log-file.mjs";
import {
  getFilename,
  pathExists,
  getFilesListFromPath,
  getFullPath,
  changeExtension,
  zipBigFile,
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

async function zippedAndDeletingBackup(filesList) {
  for (let fileName of filesList) {
    const nameArchiv = changeExtension(
      fileName,
      extentionBackup,
      extentionArchiv
    );
    const srcFullName = getFullPath(pathDestination, fileName);
    const dstFullName = getFullPath(pathDestination, nameArchiv);

    try {
      await zipBigFile(srcFullName, dstFullName);
    } catch (err) {
      writeMessage(
        `'${JSON.stringify(err)}'. Unable to ${err.type} file ${err.file}.`,
        TYPE_MESSAGE_ERROR
      );
    }

    try {
      const basename = getFilename(srcFullName);

      deleteFile(srcFullName);
      writeMessage(`  ${basename} deleted.`, TYPE_MESSAGE_INFO);
    } catch (error) {
      writeMessage(
        `Unable to ${error.type} file ${error.file}.`,
        TYPE_MESSAGE_ERROR
      );
    }
  }
}

export async function zippedBackupFiles() {
  writeMessage("Zipped.", TYPE_MESSAGE_SYST);

  if (!pathExists(pathDestination)) {
    writeMessage("Incorrect path.", TYPE_MESSAGE_ERROR);
    writeMessage("Zipped finish.", TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = getFilesListFromPath(pathDestination);
  const filesList = filterFilesList(srcFileList, verifyСonditions);

  if (filesList.length > 0) {
    await zippedAndDeletingBackup(filesList);
  } else {
    writeMessage("  No files to zipped.", TYPE_MESSAGE_INFO);
  }

  writeMessage("Zipped finish.", TYPE_MESSAGE_SYST);
}

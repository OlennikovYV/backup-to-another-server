import logWrite from "../utils/log.mjs";
import {
  TYPE_MESSAGE_SYST,
  TYPE_MESSAGE_INFO,
  TYPE_MESSAGE_ERROR,
} from "../utils/constans.mjs";
import {
  getFilesList,
  copyFiles,
  getFullName,
  getTimeCreateFile,
  getExtFile,
  fileExists,
} from "../utils/file.mjs";

async function backUpCopy(pathSource, pathDestination, storageTime) {
  logWrite("Backup.", TYPE_MESSAGE_SYST);

  if (!(fileExists(pathSource) && fileExists(pathDestination))) {
    await logWrite("Incorrect path.", TYPE_MESSAGE_ERROR);
    await logWrite("Backup finish.", TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = getFilesList(pathSource);

  const filterFileList = srcFileList.filter((el) => {
    const srcFullName = getFullName(pathSource, el);
    const fileTime = getTimeCreateFile(srcFullName);

    if (!fileTime) return false;

    const age = new Date() - new Date(fileTime);

    // TODO add to '.gz' in filter
    return (
      new Date(age).getDate() <= storageTime &&
      getExtFile(el) === ".bak" &&
      !fileExists(getFullName(pathDestination, el))
    );
  });

  if (filterFileList.length > 0) {
    for (let file of filterFileList) {
      const srcFullName = getFullName(pathSource, file);
      const dstFullName = getFullName(pathDestination, file);
      await copyFiles(srcFullName, dstFullName)
        .then((res) => await logWrite(`File ${res} copied.`, TYPE_MESSAGE_INFO))
        .catch((err) => await logWrite(err, TYPE_MESSAGE_ERROR));
    }
  } else await logWrite("No files to copy.", TYPE_MESSAGE_INFO);

  await logWrite("Backup finish.", TYPE_MESSAGE_SYST);
}

export default backUpCopy;

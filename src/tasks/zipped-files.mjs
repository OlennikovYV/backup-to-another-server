import logWrite from "../utils/log.mjs";
import {
  TYPE_MESSAGE_SYST,
  TYPE_MESSAGE_INFO,
  TYPE_MESSAGE_ERROR,
} from "../utils/constans.mjs";
import {
  getFilesList,
  getFullName,
  getTimeCreateFile,
  getExtFile,
  changeExt,
  zipFile,
  fileExists,
} from "../utils/file.mjs";

async function zippedFiles(pathSource, pathDestination, storageTime) {
  logWrite("Zipped.", TYPE_MESSAGE_SYST);

  if (!fileExists(pathSource) && !fileExists(pathDestination)) {
    logWrite("Incorrect path.", TYPE_MESSAGE_ERROR);
    return;
  }

  const srcFileList = getFilesList(pathSource);

  const filterFileList = srcFileList.filter((file) => {
    const fullName = getFullName(pathSource, file);
    const fileTime = getTimeCreateFile(fullName);

    if (!fileTime) return false;

    const age = new Date() - new Date(fileTime);
    return (
      new Date(age).getDate() <= storageTime && getExtFile(fullName) === ".bak"
    );
  });

  if (filterFileList.length > 0) {
    for (let file of filterFileList) {
      const nameArchiv = changeExt(file, ".bak", ".gz");
      const srcFullName = getFullName(pathSource, file);
      const dstFullName = getFullName(pathDestination, nameArchiv);
      await zipFile(srcFullName, dstFullName)
        .then((res) => logWrite(`Zipped file ${res}.`), TYPE_MESSAGE_INFO)
        .catch((err) => logWrite(err, TYPE_MESSAGE_ERROR));
    }
  } else {
    logWrite("No files to zipped.", TYPE_MESSAGE_INFO);
  }

  logWrite("Zipped finish.", TYPE_MESSAGE_SYST);
}

export default zippedFiles;

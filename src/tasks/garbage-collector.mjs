import logWrite from "../utils/log.mjs";
import { TYPE_MESSAGE_SYST, TYPE_MESSAGE_ERROR } from "../utils/constans.mjs";
import { fileExists } from "../utils/file.mjs";

function garbageCollector(pathSource, storageTime) {
  logWrite("Garbage.", TYPE_MESSAGE_SYST);

  if (!fileExists(pathSource)) {
    logWrite("Incorrect path.", TYPE_MESSAGE_ERROR);
    return;
  }

  const sourceFileList = getFilesList(pathSource);

  const filterFileList = sourceFileList.filter((el) => {
    const fullName = getFullName(pathSource, el);
    const fileTime = getTimeCreateFile(fullName);

    if (!fileTime) return false;

    const ageFile = new Date() - new Date(fileTime);
    return (
      new Date(ageFile).getDate() > storageTime &&
      (getExtFile(fullName) === ".bak" || getExtFile(fullName) === ".gz")
    );
  });

  filterFileList.forEach((file) => {
    const fullName = getFullName(pathSource, file);
    if (fileExists(fullName)) deleteFile(fullName);
  });

  logWrite("Garbage.", TYPE_MESSAGE_SYST);
}

export default garbageCollector;

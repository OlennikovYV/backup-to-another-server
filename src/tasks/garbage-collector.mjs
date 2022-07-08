import * as mLog from "../utils/log.mjs";
import * as mFile from "../utils/file.mjs";

export function garbageCollector(pathSource, storageTime) {
  mLog.logWrite("Garbage.", mLog.TYPE_MESSAGE_SYST);

  if (!mFile.fileExists(pathSource)) {
    mLog.logWrite("Incorrect path.", mLog.TYPE_MESSAGE_ERROR);
    return;
  }

  const sourceFileList = mFile.getFilesList(pathSource);

  const filterFileList = sourceFileList.filter((el) => {
    const fullName = mFile.getFullName(pathSource, el);
    const fileTime = mFile.getTimeCreateFile(fullName);

    if (!fileTime) return false;

    const ageFile = new Date() - new Date(fileTime);
    return (
      new Date(ageFile).getDate() > storageTime &&
      (mFile.getExtFile(fullName) === ".bak" ||
        mFile.getExtFile(fullName) === ".gz")
    );
  });

  filterFileList.forEach((file) => {
    const fullName = mFile.getFullName(pathSource, file);
    if (mFile.fileExists(fullName)) mFile.deleteFile(fullName);
  });

  mLog.logWrite("Garbage.", mLog.TYPE_MESSAGE_SYST);
}

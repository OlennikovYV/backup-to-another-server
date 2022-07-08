import * as mLog from "../utils/log.mjs";
import * as mFile from "../utils/file.mjs";

export async function zippedFiles(pathDestination, storageTime) {
  mLog.logWrite("Zipped.", mLog.TYPE_MESSAGE_SYST);

  if (!mFile.fileExists(pathDestination)) {
    mLog.logWrite("Incorrect path.", mLog.TYPE_MESSAGE_ERROR);
    return;
  }

  const srcFileList = mFile.getFilesList(pathDestination);

  const filterFileList = srcFileList.filter((file) => {
    const fullName = mFile.getFullName(pathDestination, file);
    const fileTime = mFile.getTimeCreateFile(fullName);

    if (!fileTime) return false;

    const age = new Date() - new Date(fileTime);

    return (
      new Date(age).getDate() <= storageTime &&
      mFile.getExtFile(fullName) === ".bak"
    );
  });

  if (filterFileList.length > 0) {
    for (let file of filterFileList) {
      const nameArchiv = mFile.changeExt(file, ".bak", ".gz");
      const srcFullName = mFile.getFullName(pathDestination, file);
      const dstFullName = mFile.getFullName(pathDestination, nameArchiv);

      await mFile
        .zipFile(srcFullName, dstFullName)
        .then((res) => {
          mLog.logWrite(`Zipped file ${res}.`, mLog.TYPE_MESSAGE_INFO);
          return;
        })
        .catch((err) => mLog.logWrite(err, mLog.TYPE_MESSAGE_ERROR));
    }
  } else {
    mLog.logWrite("No files to zipped.", mLog.TYPE_MESSAGE_INFO);
  }

  mLog.logWrite("Zipped finish.", mLog.TYPE_MESSAGE_SYST);

  return;
}

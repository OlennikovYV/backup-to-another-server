import * as mLog from "../utils/log.mjs";
import * as mFile from "../utils/file.mjs";

export async function backUpCopy(pathSource, pathDestination, storageTime) {
  mLog.logWrite("Backup.", mLog.TYPE_MESSAGE_SYST);

  if (!(mFile.fileExists(pathSource) && mFile.fileExists(pathDestination))) {
    await mLog.logWrite("Incorrect path.", mLog.TYPE_MESSAGE_ERROR);
    await mLog.logWrite("Backup finish.", mLog.TYPE_MESSAGE_SYST);
    return;
  }

  const srcFileList = mFile.getFilesList(pathSource);

  const filterFileList = srcFileList.filter((el) => {
    const srcFullName = mFile.getFullName(pathSource, el);
    const fileTime = mFile.getTimeCreateFile(srcFullName);

    if (!fileTime) return false;

    const age = new Date() - new Date(fileTime);

    // TODO add to '.gz' in filter
    return (
      new Date(age).getDate() <= storageTime &&
      mFile.getExtFile(el) === ".bak" &&
      !mFile.fileExists(mFile.getFullName(pathDestination, el))
    );
  });

  if (filterFileList.length > 0) {
    for (let file of filterFileList) {
      const srcFullName = mFile.getFullName(pathSource, file);
      const dstFullName = mFile.getFullName(pathDestination, file);
      await mFile
        .copyFiles(srcFullName, dstFullName)
        .then((res) => {
          mLog.logWrite(`File ${res} copied.`, mLog.TYPE_MESSAGE_INFO);
          return;
        })
        .catch((err) => mLog.logWrite(err, mLog.TYPE_MESSAGE_ERROR));
    }
  } else mLog.logWrite("No files to copy.", mLog.TYPE_MESSAGE_INFO);

  mLog.logWrite("Backup finish.", mLog.TYPE_MESSAGE_SYST);

  return;
}

import logWrite from "./utils/log.mjs";
import {
  changeExt,
  copyFiles,
  deleteFile,
  getExtFile,
  getFilesList,
  getFullName,
  getTimeCreateFile,
} from "./utils/file.mjs";

const TYPE_MESSAGE_SYST = "SYST";
const TYPE_MESSAGE_INFO = "INFO";

class workFS {
  constructor(srcPath, dstPath, storageTime = 10) {
    this._src = srcPath;
    this._dst = dstPath;
    this._storageTime = storageTime;
  }

  get src() {
    return this._src;
  }
  get dst() {
    return this._dst;
  }
  get storageTime() {
    return this._storageTime;
  }

  async backUpCopy() {
    logWrite("Backup.");

    const srcFileList = getFilesList(this.src);

    const filterFileList = srcFileList.filter((el) => {
      const srcFullName = getFullName(this.src, el);
      const fileTime = getTimeCreateFile(srcFullName);

      if (!fileTime) return false;

      const age = new Date() - new Date(fileTime);

      // TODO add to '.gz' in filter
      return (
        new Date(age).getDate() <= this.storageTime &&
        getExtFile(el) === ".bak" &&
        !fileExists(getFullName(this.dst, el))
      );
    });

    if (filterFileList.length > 0) {
      for (let file of filterFileList) {
        const srcFullName = getFullName(this.src, file);
        const dstFullName = getFullName(this.dst, file);
        await copyFiles(srcFullName, dstFullName)
          .then((res) => logWrite(`File ${res} copied.`, TYPE_MESSAGE_INFO))
          .catch((err) => logWrite(err));
      }
    } else logWrite("No files to copy.", TYPE_MESSAGE_INFO);

    logWrite("Backup finish.");
  }
  garbageCollector() {
    logWrite("Garbage.");
    const dstFileList = getFilesList(this.dst);

    const filterFileList = dstFileList.filter((el) => {
      const fullName = getFullName(this.dst, el);
      const fileTime = getTimeCreateFile(fullName);

      if (!fileTime) return false;

      const age = new Date() - new Date(fileTime);
      return (
        new Date(age).getDate() > this.storageTime &&
        (getExtFile(fullName) === ".bak" || getExtFile(fullName) === ".gz")
      );
    });
    filterFileList.forEach((file) => {
      const fullName = getFullName(this.dst, file);
      if (fileExists(fullName)) deleteFile(fullName);
    });
    logWrite("Garbage.");
  }
  async zippedFiles() {
    logWrite("Zipped.");
    const dstFileList = getFilesList(this.dst);

    const filterFileList = dstFileList.filter((file) => {
      const fullName = getFullName(this.dst, file);
      const fileTime = getTimeCreateFile(fullName);

      if (!fileTime) return false;

      const age = new Date() - new Date(fileTime);
      return (
        new Date(age).getDate() <= this.storageTime &&
        getExtFile(fullName) === ".bak"
      );
    });

    if (filterFileList.length > 0) {
      for (let file of filterFileList) {
        const nameArchiv = changeExt(file, ".bak", ".gz");
        const srcFullName = getFullName(this.dst, file);
        const dstFullName = getFullName(this.dst, nameArchiv);
        await this.zipFile(srcFullName, dstFullName)
          .then((res) => logWrite(`Zipped file ${res}.`))
          .catch((err) => logWrite(err));
      }
    } else {
      logWrite("No files to zipped.");
    }

    logWrite("Zipped finish.");
  }
}

async function runTasks(srcDir, dstDir, storageTime = 30, executeTasks = {}) {
  const work = new workFS(srcDir, dstDir, storageTime);

  logWrite("Job start.");

  if (!work.fileExists(srcDir) && !work.fileExists(dstDir)) return;

  // TODO Revise the method of starting tasks
  if (executeTasks["backup"]) await work.backUpCopy();
  if (executeTasks["zipped"]) await work.zippedFiles();
  if (executeTasks["garbage"]) work.garbageCollector();

  logWrite("End of job.");
  logWrite("");
}

export { runTasks };

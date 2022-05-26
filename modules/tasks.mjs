import fs from "fs";
import path from "path";
import zlib from "zlib";

import { Log } from "./log.mjs";

class workFS {
  constructor(srcPath, dstPath, storageTime = 10, logFileStr) {
    this._src = srcPath;
    this._dst = dstPath;
    this._storageTime = storageTime;
    this._logStream = new Log(logFileStr);
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

  logWrite(text) {
    this._logStream.logs(text);
  }
  getFullName(dir, fileName) {
    return path.join(dir, fileName);
  }
  getExtFile(fileName) {
    return path.extname(fileName);
  }
  getFilesList(path) {
    return fs.readdirSync(path);
  }
  fileExists(fileName) {
    return fs.existsSync(fileName);
  }
  changeExt(fileName, fromExt, toExt) {
    const regexp = new RegExp(fromExt + "$");
    return fileName.replace(regexp, toExt);
  }
  timeCreateFile(fileName) {
    let stat;
    if (this.fileExists(fileName))
      stat = fs.statSync(fileName, (err) => {
        if (err) throw err;
      });
    return stat ? stat.ctime : 0;
  }
  copyFiles(srcFile, dstFile) {
    return new Promise((resolve, reject) => {
      const read = fs.createReadStream(srcFile);
      read.on("error", (err) => reject(err));
      const write = fs.createWriteStream(dstFile);
      write.on("error", (err) => reject(err));
      write.on("close", () => resolve(dstFile));
      read.pipe(write);
    });
  }
  deleteFile(fileName) {
    if (this.fileExists(fileName))
      fs.unlink(fileName, (err) => {
        if (err) throw err;
        this.logWrite(`${fileName} was deleted.`);
      });
  }
  zipFile(srcFile, archiv) {
    return new Promise((resolve, reject) => {
      let readableStream = fs.createReadStream(srcFile, "utf8");
      readableStream.on("error", (err) => reject(err));
      let writeableStream = fs.createWriteStream(archiv);
      writeableStream.on("error", (err) => reject(err));

      readableStream.on("close", () => {
        this.deleteFile(srcFile);
        resolve(srcFile);
      });

      let gzip = zlib.createGzip();
      readableStream.pipe(gzip).pipe(writeableStream);
    });
  }
  async backUpCopy() {
    this.logWrite("Backup.");

    const srcFileList = this.getFilesList(this.src);

    const filterFileList = srcFileList.filter((el) => {
      const srcFullName = this.getFullName(this.src, el);
      const fileTime = this.timeCreateFile(srcFullName);

      if (!fileTime) return false;

      const age = new Date() - new Date(fileTime);

      // TODO add to '.gz' in filter
      return (
        new Date(age).getDate() <= this.storageTime &&
        this.getExtFile(el) === ".bak" &&
        !this.fileExists(this.getFullName(this.dst, el))
      );
    });

    if (filterFileList.length > 0) {
      for (let file of filterFileList) {
        const srcFullName = this.getFullName(this.src, file);
        const dstFullName = this.getFullName(this.dst, file);
        await this.copyFiles(srcFullName, dstFullName)
          .then((res) => this.logWrite(`File ${res} copied.`))
          .catch((err) => this.logWrite(err));
      }
    } else this.logWrite("No files to copy.");

    this.logWrite("Backup finish.");
  }
  garbageCollector() {
    this.logWrite("Garbage.");
    const dstFileList = this.getFilesList(this.dst);

    const filterFileList = dstFileList.filter((el) => {
      const fullName = this.getFullName(this.dst, el);
      const fileTime = this.timeCreateFile(fullName);

      if (!fileTime) return false;

      const age = new Date() - new Date(fileTime);
      return (
        new Date(age).getDate() > this.storageTime &&
        (this.getExtFile(fullName) === ".bak" ||
          this.getExtFile(fullName) === ".gz")
      );
    });
    filterFileList.forEach((file) => {
      const fullName = this.getFullName(this.dst, file);
      if (this.fileExists(fullName)) this.deleteFile(fullName);
    });
    this.logWrite("Garbage.");
  }
  async zippedFiles() {
    this.logWrite("Zipped.");
    const dstFileList = this.getFilesList(this.dst);

    const filterFileList = dstFileList.filter((file) => {
      const fullName = this.getFullName(this.dst, file);
      const fileTime = this.timeCreateFile(fullName);

      if (!fileTime) return false;

      const age = new Date() - new Date(fileTime);
      return (
        new Date(age).getDate() <= this.storageTime &&
        this.getExtFile(fullName) === ".bak"
      );
    });

    if (filterFileList.length > 0) {
      for (let file of filterFileList) {
        const nameArchiv = this.changeExt(file, ".bak", ".gz");
        const srcFullName = this.getFullName(this.dst, file);
        const dstFullName = this.getFullName(this.dst, nameArchiv);
        await this.zipFile(srcFullName, dstFullName)
          .then((res) => this.logWrite(`Zipped file ${res}.`))
          .catch((err) => this.logWrite(err));
      }
    } else {
      this.logWrite("No files to zipped.");
    }

    this.logWrite("Zipped finish.");
  }
  close() {
    this._logStream.closeStream();
  }
}

async function runTasks(
  srcDir,
  dstDir,
  storageTime = 30,
  logFileStr,
  executeTasks = {}
) {
  const work = new workFS(srcDir, dstDir, storageTime, logFileStr);

  work.logWrite("Execute tasks.");

  if (!work.fileExists(srcDir) && !work.fileExists(dstDir)) return;

  // TODO Revise the method of starting tasks
  if (executeTasks["backup"]) await work.backUpCopy();
  if (executeTasks["zipped"]) await work.zippedFiles();
  if (executeTasks["garbage"]) work.garbageCollector();

  work.logWrite("Execute tasks finish.");
  work.close();
}

export { runTasks };

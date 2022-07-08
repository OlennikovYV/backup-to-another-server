import fs from "fs";
import path from "path";
import zlib from "zlib";

import * as mLog from "./log.mjs";

export function getFullName(dir, fileName) {
  return path.join(dir, fileName);
}

export function getExtFile(fileName) {
  return path.extname(fileName);
}

export function getFilesList(path) {
  return fs.readdirSync(path);
}

export function fileExists(fileName) {
  return fs.existsSync(fileName);
}

export function changeExt(fileName, fromExt, toExt) {
  const regexp = new RegExp(fromExt + "$");
  return fileName.replace(regexp, toExt);
}

export function getTimeCreateFile(fileName) {
  let stat;
  if (fileExists(fileName))
    stat = fs.statSync(fileName, (err) => {
      if (err) throw err;
    });
  return stat ? stat.ctime : 0;
}

export function copyFiles(srcFile, dstFile) {
  return new Promise((resolve, reject) => {
    const read = fs.createReadStream(srcFile);
    read.on("error", (err) => reject(err));
    const write = fs.createWriteStream(dstFile);
    write.on("error", (err) => reject(err));
    write.on("close", () => resolve(dstFile));
    read.pipe(write);
  });
}

export function deleteFile(fileName) {
  if (fileExists(fileName))
    fs.unlink(fileName, (err) => {
      if (err) throw err;
      mLog.logWrite(`${fileName} was deleted.`, mLog.TYPE_MESSAGE_INFO);
    });
}

export function zipFile(srcFile, archiv) {
  return new Promise((resolve, reject) => {
    let readableStream = fs.createReadStream(srcFile, "utf8");
    readableStream.on("error", (err) => reject(err));
    let writeableStream = fs.createWriteStream(archiv);
    writeableStream.on("error", (err) => reject(err));

    readableStream.on("close", () => {
      deleteFile(srcFile);
      resolve(srcFile);
    });

    let gzip = zlib.createGzip();
    readableStream.pipe(gzip).pipe(writeableStream);
  });
}

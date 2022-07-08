import fs from "fs";
import path from "path";
import zlib from "zlib";

import * as mLog from "./log-file.mjs";

export function getFullPath(dir, fileName) {
  return path.join(dir, fileName);
}

export function getFileExtension(fileName) {
  return path.extname(fileName);
}

export function getFilesListFromPath(path) {
  return fs.readdirSync(path);
}

export function fileExists(fileName) {
  return fs.existsSync(fileName);
}

export function changeExtension(
  fileName,
  originalExtension,
  replaceableExtension
) {
  const regexp = new RegExp(originalExtension + "$");
  return fileName.replace(regexp, replaceableExtension);
}

export function getFileCreationDate(fileName) {
  let fileInformation;
  if (fileExists(fileName))
    fileInformation = fs.statSync(fileName, (err) => {
      if (err) throw err;
    });
  return fileInformation ? fileInformation.ctime : 0;
}

export function copyFiles(srcFile, dstFile) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(srcFile);
    readStream.on("error", (err) => reject(err));
    const writeStream = fs.createWriteStream(dstFile);
    writeStream.on("error", (err) => reject(err));
    writeStream.on("close", () => resolve(dstFile));
    readStream.pipe(writeStream);
  });
}

export function deleteFile(fileName) {
  if (fileExists(fileName))
    fs.unlink(fileName, (err) => {
      if (err) throw err;
      mLog.writeMessage(`${fileName} was deleted.`, mLog.TYPE_MESSAGE_INFO);
    });
}

export function zipFile(srcFile, archiv) {
  return new Promise((resolve, reject) => {
    let gzip = zlib.createGzip();
    let readableStream = fs.createReadStream(srcFile, "utf8");
    let writeableStream = fs.createWriteStream(archiv);

    readableStream.on("error", (err) => reject(err));
    writeableStream.on("error", (err) => reject(err));

    readableStream.on("close", () => {
      deleteFile(srcFile);
      resolve(srcFile);
    });

    readableStream.pipe(gzip).pipe(writeableStream);
  });
}

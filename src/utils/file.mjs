import fs from "fs";
import path from "path";

import zlib from "zlib";

function getFullName(dir, fileName) {
  return path.join(dir, fileName);
}

function getExtFile(fileName) {
  return path.extname(fileName);
}

function getFilesList(path) {
  return fs.readdirSync(path);
}

function fileExists(fileName) {
  return fs.existsSync(fileName);
}

function changeExt(fileName, fromExt, toExt) {
  const regexp = new RegExp(fromExt + "$");
  return fileName.replace(regexp, toExt);
}

function getTimeCreateFile(fileName) {
  let stat;
  if (fileExists(fileName))
    stat = fs.statSync(fileName, (err) => {
      if (err) throw err;
    });
  return stat ? stat.ctime : 0;
}

function copyFiles(srcFile, dstFile) {
  return new Promise((resolve, reject) => {
    const read = fs.createReadStream(srcFile);
    read.on("error", (err) => reject(err));
    const write = fs.createWriteStream(dstFile);
    write.on("error", (err) => reject(err));
    write.on("close", () => resolve(dstFile));
    read.pipe(write);
  });
}

function deleteFile(fileName) {
  if (fileExists(fileName))
    fs.unlink(fileName, (err) => {
      if (err) throw err;
      logWrite(`${fileName} was deleted.`);
    });
}

function zipFile(srcFile, archiv) {
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

export {
  getFullName,
  getExtFile,
  getFilesList,
  fileExists,
  changeExt,
  getTimeCreateFile,
  copyFiles,
  deleteFile,
  zipFile,
};

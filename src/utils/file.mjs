import fs from "fs";
import path from "path";
import zlib from "zlib";

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

export function deleteFile(fileName) {
  fs.unlinkSync(fileName);
}

export function getFileCreationDate(fileName) {
  let fileInformation;
  if (fileExists(fileName))
    fileInformation = fs.statSync(fileName, (err) => {
      if (err) throw err;
    });
  return fileInformation ? fileInformation.ctime : 0;
}

function readFileToBuffer(fileName) {
  const fileDescriptor = fs.openSync(fileName);
  const buffer = fs.readFileSync(fileDescriptor);
  fs.closeSync(fileDescriptor);
  return buffer;
}

function writeFileFromBuffer(fileName, buffer) {
  fs.writeFileSync(fileName, buffer);
}

export function zipFile(srcFile, archiv) {
  let buffer = readFileToBuffer(srcFile);
  buffer = zlib.gzipSync(buffer);
  writeFileFromBuffer(archiv, buffer);
}

export function copyFile(srcFile, dstFile) {
  writeFileFromBuffer(dstFile, readFileToBuffer(srcFile));
}

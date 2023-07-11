import fs from "fs";
import path from "path";
import zlib from "zlib";
import AdmZip from "adm-zip";
import { TYPE_MESSAGE_INFO, writeMessage } from "./log-file.mjs";

export function getFilename(absolutePath) {
  try {
    let filename = path.basename(absolutePath);

    return filename;
  } catch (error) {
    throw { type: "delete", file: absolutePath };
  }
}

export function getFullPath(dir, fileName) {
  return path.join(dir, fileName);
}

export function getFileExtension(fileName) {
  return path.extname(fileName);
}

export function getFilesListFromPath(path) {
  return fs.readdirSync(path);
}

export function pathExists(fileName) {
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
  try {
    fs.unlinkSync(fileName);
  } catch {
    throw { type: "delete", file: fileName };
  }
}

export function getFileCreationTime(fileName) {
  let fileInformation;
  if (pathExists(fileName))
    fileInformation = fs.statSync(fileName, (err) => {
      if (err) throw err;
    });
  return fileInformation ? fileInformation.ctime : 0;
}

function readFileToBuffer(fileName) {
  try {
    const fileDescriptor = fs.openSync(fileName);
    const buffer = fs.readFileSync(fileDescriptor);
    fs.closeSync(fileDescriptor);
    return buffer;
  } catch (error) {
    throw { type: "read", file: fileName, error: error };
  }
}

function writeFileFromBuffer(fileName, buffer) {
  try {
    fs.writeFileSync(fileName, buffer);
  } catch (error) {
    throw { type: "write", file: fileName, error: error };
  }
}

export function zipFile(srcFile, archiv) {
  try {
    let buffer = readFileToBuffer(srcFile);
    buffer = zlib.gzipSync(buffer);
    writeFileFromBuffer(archiv, buffer);
  } catch (err) {
    if (err.type) throw err;
    throw { type: "archive", file: srcFile, error: err };
  }
}

export function zipFileAdm(srcFile, archiv) {
  try {
    let zip = new AdmZip();
    zip.addLocalFile(srcFile);
    zip.writeZip(archiv);
  } catch (err) {
    if (err.type) throw err;
    throw { type: "archive", file: srcFile };
  }
}

export async function zipBigFile(srcFile, archiv) {
  return new Promise((resolve, reject) => {
    const gzip = zlib.createGzip();
    const input = fs.createReadStream(srcFile);
    const output = fs.createWriteStream(archiv);

    const stream = input.pipe(gzip).pipe(output);

    stream.on("error", (error) =>
      reject({ type: "archived", file: getFilename(srcFile), error: error })
    );

    stream.on("finish", () => {
      writeMessage(`  ${getFilename(archiv)} zipped.`, TYPE_MESSAGE_INFO);
      resolve();
    });
  });
}

export function copyFile(srcFile, dstFile) {
  try {
    const buffer = readFileToBuffer(srcFile);
    writeFileFromBuffer(dstFile, buffer);
  } catch (err) {
    throw err;
  }
}

export function copyBigFile(srcFile, dstFile) {
  try {
    fs.copyFileSync(srcFile, dstFile);
  } catch (error) {
    if (error) {
      throw { type: "copy", file: srcFile, error: error };
    }
  }
}

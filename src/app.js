import backUpCopy from "./modules/tasks/backup.mjs";
import zippedFiles from "./modules/tasks/zipped-files.mjs";
import garbageCollector from "./modules/tasks/garbage-collector.mjs";

const pathSource = "D:\\\\project\\backup-to-another-server\\source";
const pathDestination = "D:\\\\project\\backup-to-another-server\\destination";
const storageTime = 100;

async (function runTasks() {
  // TODO Revise the method of starting tasks
  await backUpCopy(pathSource, pathDestination, storageTime);
  await zippedFiles(pathSource, pathDestination, storageTime);
  garbageCollector(pathSource, storageTime);
})()

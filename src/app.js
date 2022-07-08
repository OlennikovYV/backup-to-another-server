import { backUpCopy } from "./tasks/backup.mjs";
import { zippedFiles } from "./tasks/zipped-files.mjs";
import { garbageCollector } from "./tasks/garbage-collector.mjs";

const pathSource = "D:\\project\\backup-to-another-server\\test-source";
const pathDestination =
  "D:\\project\\backup-to-another-server\\test-destination";
const storageTime = 100;

(async function runTasks() {
  // TODO Revise the method of starting tasks
  await backUpCopy(pathSource, pathDestination, storageTime);
  await zippedFiles(pathDestination, storageTime);
  garbageCollector(pathSource, storageTime);
})();

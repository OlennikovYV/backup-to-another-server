import { copyBackupFiles } from "./tasks/copy-backup-files.mjs";
import { zippedBackupFiles } from "./tasks/zipped-files.mjs";
import { garbageFiles } from "./tasks/delete-expired-files.mjs";

(function runTasks() {
  copyBackupFiles();
  // zippedBackupFiles();
  // garbageFiles();
})();

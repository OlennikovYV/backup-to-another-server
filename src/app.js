import { copyBackupFiles } from "./tasks/copy-backup-files.mjs";
import { zippedBackupFiles } from "./tasks/zipped-files.mjs";
import { deleteExpiredFiles } from "./tasks/delete-expired-files.mjs";
import * as constants from "./utils/constants.mjs";

(function runTasks() {
  const pathDestination = constants.pathDestination;
  const expirationInDays = constants.expirationInDays;

  copyBackupFiles();
  zippedBackupFiles();
  deleteExpiredFiles(pathDestination, expirationInDays);
})();

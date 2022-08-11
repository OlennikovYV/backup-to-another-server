import { copyBackupFiles } from "./tasks/copy-backup-files.mjs";
import { zippedFiles } from "./tasks/zipped-files.mjs";
import { deleteExpiredFiles } from "./tasks/delete-expired-files.mjs";
import * as constants from "./utils/constants.mjs";

(function runTasks() {
  const pathSource = constants.pathSource;
  const pathDestination = constants.pathDestination;
  const expirationInDays = constants.expirationInDays;

  copyBackupFiles(pathSource, pathDestination, expirationInDays);
  zippedFiles(pathDestination, expirationInDays);
  deleteExpiredFiles(pathDestination, expirationInDays);
})();

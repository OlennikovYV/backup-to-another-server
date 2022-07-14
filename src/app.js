import { copyBackupFiles } from "./tasks/copy-backup-files.mjs";
import { zippedFiles } from "./tasks/zipped-files.mjs";
import { deleteExpiredFiles } from "./tasks/delete-expired-files.mjs";

(function runTasks() {
  const pathSource = "D:\\project\\backup-to-another-server\\test-source";
  const pathDestination =
    "D:\\project\\backup-to-another-server\\test-destination";
  const expirationInDays = 100;

  copyBackupFiles(pathSource, pathDestination, expirationInDays);
  zippedFiles(pathDestination, expirationInDays);
  deleteExpiredFiles(pathDestination, expirationInDays);
})();

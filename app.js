import { runTasks } from "./modules/tasks.mjs";

runTasks(
  "D:\\\\project\\backup-to-another-server\\src",
  "D:\\\\project\\backup-to-another-server\\dst",
  100,
  {
    backup: true,
    garbage: false,
    zipped: false,
  }
);

import { runTasks } from './modules/tasks.mjs';

runTasks(
    'D:\\project\\src\\',
    'D:\\project\\dst\\',
    100,
    'd:\\project\\run-tasks.log.txt', { backup: true, garbage: false, zipped: false }
);
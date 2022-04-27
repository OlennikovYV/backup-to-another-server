import { runTasks } from './modules/tasks.mjs';

runTasks('D:\\project\\src\\', 'D:\\project\\dst\\', 100, { backup: true, garbage: true, zipped: true });
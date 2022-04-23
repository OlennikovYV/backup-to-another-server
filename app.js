import { runTasks } from './modules/tasks.mjs';

runTasks('D:\\Copy\\src\\', 'D:\\Copy\\dst\\', 8, { backup: true, garbage: true, zipped: true });
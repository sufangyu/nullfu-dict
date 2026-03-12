import type { TaskItem } from './types.ts';
import { runTasks } from './task-runner.ts';

const taskList: TaskItem[] = [
  {
    id: 'core',
    projectName: 'core',
    type: 'build',
    mode: 'production',
  },
  {
    id: 'vue',
    projectName: 'vue',
    type: 'build',
    mode: 'production',
    dependsOn: ['core'],
  },
];

runTasks(taskList, 4);

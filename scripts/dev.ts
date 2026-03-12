import type { TaskItem } from './types.ts';
import { runTasks } from './task-runner.ts';

const taskList: TaskItem[] = [
  {
    id: 'core',
    projectName: 'core',
    type: 'build',
    mode: 'development',
  },
  {
    id: 'vue',
    projectName: 'vue',
    type: 'build',
    mode: 'development',
    dependsOn: ['core'],
  },
  // {
  //   id: 'react',
  //   type: 'script',
  //   projectName: 'react',
  //   scriptName: 'dev',
  //   dependsOn: ['core'],
  //   // watch: [
  //   //   'packages/web/src',
  //   //   'packages/core/src',
  //   // ],
  // },
];

runTasks(taskList, 1);

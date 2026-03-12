import type { TaskItem } from './types.ts';
import chokidar from 'chokidar';
import consola from 'consola';
import PQueue from 'p-queue';
import { getBuildTask, getScriptTask, sleep } from './utils.ts';


/**
 * 运行任务
 * @param taskList 任务配置列表
 * @param parallelLimit 同时运行任务数量
 */
export async function runTasks(taskList: TaskItem[], parallelLimit = 4) {
  consola.info('🧩 准备处理任务依赖拓扑排序...');
  const sortedTasks = topoSort(taskList);
  consola.success('📌 拓扑排序完成:', sortedTasks.map(t => t.id));

  const queue = new PQueue({ concurrency: parallelLimit });

  // 保存每个任务的最新 promise
  const taskPromisesMap = new Map<string, Promise<unknown>>();

  // 创建 runner 并加入队列
  const createQueuedRunner = (task: TaskItem) => {
    const runner = async () => {
      // 等待依赖完成
      if (task.dependsOn?.length) {
        await Promise.all(task.dependsOn.map(dep => taskPromisesMap.get(dep)!));
      }

      await sleep(200);
      consola.info(`🚀 执行: ${task.id}`);
      return createRunner(task)();
    };

    // queue.add 返回一个 promise
    const queuedPromise = queue.add(runner);
    taskPromisesMap.set(task.id, queuedPromise);
    return queuedPromise;
  };

  // 初始化任务队列
  sortedTasks.forEach((task) => {
    createQueuedRunner(task);

    // watch 监听
    if (task.watch?.length) {
      const watcher = chokidar.watch(task.watch, { ignoreInitial: true });
      watcher.on('all', () => {
        consola.info(`🔄 ${task.id} 触发文件变更，重新执行...`);
        createQueuedRunner(task);
      });
    }
  });

  // 等待所有任务完成
  await Promise.all(taskPromisesMap.values());
  consola.success('🎉 所有任务执行完成！');
}


/**
 * 创建任务执行函数
 * @param task
 * @returns 任务执行函数
 */
function createRunner(task: TaskItem): () => Promise<unknown> {
  switch (task.type) {
    case 'build':
      return getBuildTask(task.projectName, task.mode, task.viteConfigPath);
    case 'script':
      return getScriptTask(task.projectName, task.scriptName);
    default:
      throw new Error(`未知任务类型: ${(task as any).type}`);
  }
}


/**
 * 拓扑排序
 * @param tasks 排序任务配置列表
 */
export function topoSort(tasks: TaskItem[]): TaskItem[] {
  const graph = new Map<string, string[]>();
  const indegree = new Map<string, number>();

  // 初始化入度
  tasks.forEach((t) => {
    indegree.set(t.id, 0);
    graph.set(t.id, []);
  });


  // 建图
  tasks.forEach((t) => {
    if (t.dependsOn) {
      t.dependsOn.forEach((dep) => {
        if (!graph.has(dep)) {
          throw new Error(`依赖任务不存在: ${dep}`);
        }

        graph.get(dep)!.push(t.id);
        indegree.set(t.id, (indegree.get(t.id) || 0) + 1);
      });
      // for (const dep of t.dependsOn) {
      //   graph.get(dep)!.push(t.id);
      //   indegree.set(t.id, (indegree.get(t.id) || 0) + 1);
      // }
    }
  });


  // Kahn 拓扑排序
  const queue: string[] = [];
  const result: TaskItem[] = [];

  for (const [id, degree] of indegree.entries()) {
    if (degree === 0) {
      queue.push(id);
    }
  }

  while (queue.length) {
    const id = queue.shift()!;
    const task = tasks.find(t => t.id === id)!;
    result.push(task);

    for (const next of graph.get(id) || []) {
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) {
        queue.push(next);
      }
    }
  }

  if (result.length !== tasks.length) {
    throw new Error('任务依赖存在循环，请检查 dependsOn 配置。');
  }

  return result;
}

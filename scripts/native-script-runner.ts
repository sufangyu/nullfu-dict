/**
 * Monorepo Script Runner
 *
 * 用于在 Monorepo 中统一执行子包脚本（test / lint 等）, 不存在依赖关系的脚本命令
 *
 * 使用示例：
 *
 * 执行所有子包 test
 * pnpm run runner test
 *
 * 执行指定子包
 * pnpm run runner test core vue
 *
 * 控制并发
 * pnpm run runner test core vue --concurrency 8
 *
 * 遇到错误立即停止
 * pnpm run runner test core vue --bail
 */

import type { PackageJson, ScriptTaskNative } from './types';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { consola } from 'consola';
import fg from 'fast-glob';
import minimist from 'minimist';
import { readYamlField, runScript } from './utils';


/**
 * Monorepo 根目录
 *
 * @description 默认取当前工作目录
 */
const rootDir = path.resolve(process.cwd());

async function main() {
  // 1. 解析 CLI 参数
  const cli = parseCli();

  if (cli.packages) {
    consola.info(`filter packages: ${[...cli.packages].join(', ')}`);
  }

  // 2. 收集需要执行的任务
  const tasks = await collectTestTasks(cli);
  if (!tasks.length) {
    consola.warn(`没有找到可执行 ${cli.script} 的子包`);
  }

  await runTasks(tasks, cli);
}

main().catch((err) => {
  consola.error(err);
  process.exitCode = 1;
});


/**
 * 执行任务
 * @param tasks 任务列表
 * @param cli 命令行配置
 */
async function runTasks(tasks: ScriptTaskNative[], cli: ReturnType<typeof parseCli>) {
  const queue = [...tasks];
  const running: Promise<void>[] = [];

  let failed = false;

  async function run(task: ScriptTaskNative) {
    const label = `[${task.name}]`;
    consola.start(`${label} ${task.script}`);

    // 任务预检：目录下缺少 package.json 或未定义对应 script 时直接跳过
    const pkgPath = path.join(task.dir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      consola.warn(`${label} skip: missing package.json`);
      return;
    }
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as PackageJson;
      if (!pkg.scripts?.[task.script]) {
        consola.warn(`${label} skip: script "${task.script}" not found`);
        return;
      }
    } catch {
      consola.warn(`${label} skip: invalid package.json`);
      return;
    }

    try {
      await runScript('run', task.script, {
        cwd: task.dir,
        stdio: 'inherit',
        shell: true,
      });
      consola.success(`${label} success`);
    } catch (err) {
      failed = true;
      consola.error(`${label} failed`);

      if (cli.bail) {
        throw err;
      }
    }
  }

  while (queue.length || running.length) {
    while (running.length < cli.concurrency && queue.length) {
      const task = queue.shift()!;

      const p = run(task).finally(() => {
        running.splice(running.indexOf(p), 1);
      });

      running.push(p);
    }

    await Promise.race(running);
  }

  if (failed) {
    process.exitCode = 1;
  }
}


/**
 * 扫描 workspace 并收集 test 任务
 *
 * 扫描逻辑：
 * 1. 读取 pnpm-workspace.yaml
 * 2. 解析 packages pattern
 * 3. 使用 fast-glob 查找 package.json
 * 4. 过滤未定义 scripts.test 的包
 */
async function collectTestTasks(cli: ReturnType<typeof parseCli>) {
  const patterns = getWorkspacePatterns();
  const packageJsonPaths = await fg(
    patterns.map(p => `${p}/package.json`),
    {
      cwd: rootDir,
      absolute: true,
      ignore: ['**/node_modules/**'],
    },
  );

  const tasks: ScriptTaskNative[] = [];

  for (const pkgPath of packageJsonPaths) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as PackageJson;
    const dir = path.dirname(pkgPath);
    const name = path.basename(dir);

    // CLI 包过滤
    // 未指定 packages 时不过滤（执行全部）
    if (cli.packages && !cli.packages.has(name)) {
      continue;
    }

    // 未定义 script
    if (!pkg.scripts?.[cli.script]) {
      continue;
    }


    tasks.push({
      name,
      dir,
      script: cli.script,
    });
  }

  return tasks;
}


/**
 * 获取 pnpm 工作目录配置
 *
 * 示例：
 *
 * packages:
 *   - packages/*
 *   - apps/*
 */
function getWorkspacePatterns(): string[] {
  const workspaceFile = path.join(rootDir, 'pnpm-workspace.yaml');

  return readYamlField<string[]>(workspaceFile, 'packages', ['packages/*']);
}


/**
 * 解析 CLI 参数
 *
 * 示例：
 *
 * pnpm run runner test core vue
 * pnpm run runner test core vue --concurrency 8
 * pnpm run runner test core vue --bail
 */
export function parseCli(): {
  /** 脚本名称 */
  script: string,
  /** 并发数 */
  concurrency: number,
  /** 停止运行时是否立即退出 */
  bail: boolean,
  /** 要构建的包名 */
  packages: Set<string> | null,
} {
  const argvStr = process.argv.slice(2);

  if (!argvStr.length) {
    consola.error('必须指定 script, 例如: pnpm run runner:test');
    process.exit(1);
  }

  const argv = minimist(argvStr, {
    alias: { p: 'packages', c: 'concurrency', b: 'bail' },
    boolean: ['bail'],
    default: { concurrency: 4 },
  });
  consola.log('arguments::', argv);

  const [script, ...rest] = argv._;
  // 剩余参数可能是子包名
  const packages: string[] = [];
  for (const p of rest) {
    // 遇到 -- 开头就停止读取包名
    if (typeof p === 'string' && p.startsWith('--')) {
      break;
    }
    packages.push(p);
  }


  // // 第一个参数就是要执行的 script
  // const script = argv.shift()!;
  // let concurrency = 4;
  // let bail = false;

  // const packages: string[] = [];
  // for (let i = 0; i < argv.length; i++) {
  //   const arg = argv[i];
  //   if (arg === '--concurrency') {
  //     concurrency = Number(argv[++i]);
  //     continue;
  //   }
  //   if (arg === '--bail') {
  //     bail = true;
  //     continue;
  //   }
  //   // 其余当作包名
  //   packages.push(arg);
  // }

  return {
    script,
    concurrency: argv.concurrency,
    bail: argv.bail,
    packages: packages.length ? new Set(packages) : null,
  };
}

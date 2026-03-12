import type { SpawnOptions } from 'node:child_process';
import type { InlineConfig } from 'vite';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { consola } from 'consola';
import { build } from 'vite';
import yaml from 'yaml';


const LOGGER_NAMESPACE = 'BUILD';


export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


/**
 * 延迟执行
 * @param {*} duration
 * @returns 延迟执行任务
 */
export function sleep(duration: number = 1250): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), duration));
}


/**
 * 文件是否存在
 * @param filePath 文件路径
 * @param desc 不存在时的错误描述
 * @returns 是否存在结果
 */
export function ensureFileExists(filePath: string, desc: string): boolean {
  if (!fs.existsSync(filePath)) {
    consola.error(`[${LOGGER_NAMESPACE}] ${desc} 不存在: ${filePath}`);
    return false;
  }
  return true;
}


/**
 * 安全读取 JSON
 * @param filePath 文件路径
 * @returns json 文件内容
 */
export function readJson<T = any>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (e) {
    consola.error(`[${LOGGER_NAMESPACE}] JSON 解析失败: ${filePath}`, e);
    return null;
  }
}


/**
 * 获取构建任务, 使用 vite 构建
 * @param projectName 项目文件夹名称
 * @param mode 构建模式, 生产: production, 开发: development
 * @param viteConfigPath vite.config.ts 配置路径, 如果为空, 则使用项目文件夹下的 vite.config.ts 配置
 */
export function getBuildTask(
  projectName: string,
  mode: 'development' | 'production',
  viteConfigPath: string = '',
) {
  return async () => {
    const configFile = viteConfigPath || `packages/${projectName}/vite.config.ts`;
    const taskMsg = viteConfigPath
      ? `${projectName}（使用 ${path.basename(viteConfigPath)}）`
      : projectName;

    consola.start(`[${LOGGER_NAMESPACE}] ${taskMsg} 开始构建...`);
    consola.debug(`[${LOGGER_NAMESPACE}] 使用配置文件: ${configFile}`);

    const buildConfig: InlineConfig['build'] = mode === 'development' ? { watch: {} } : {};

    try {
      await build({
        configFile,
        mode,
        build: buildConfig,
      });

      consola.success(`[${LOGGER_NAMESPACE}] 🎉 ${taskMsg} 构建完成！`);
    } catch (err) {
      consola.error(`[${LOGGER_NAMESPACE}] ❌ ${taskMsg} 构建失败:`, err);
      throw err;
    }
  };
}


/**
 * 获取脚本任务, 使用 pnpm 执行脚本
 * @param projectName 项目文件夹名称
 * @param scriptName 脚本名称
 */
export function getScriptTask(projectName: string, scriptName: string) {
  return async () => {
    const projectPath = path.resolve(__dirname, '..', 'packages', projectName);
    const packageJsonPath = path.join(projectPath, 'package.json');

    // 校验路径
    if (!ensureFileExists(projectPath, '项目目录')) {
      return;
    }
    if (!ensureFileExists(packageJsonPath, 'package.json')) {
      return;
    }


    // 读取 package.json 文件
    const packageJson = readJson<{ scripts: Record<string, string> }>(packageJsonPath);
    if (!packageJson) {
      return;
    }
    if (!packageJson.scripts?.[scriptName]) {
      consola.error(`[${LOGGER_NAMESPACE}] ${projectName} 中不存在脚本 "${scriptName}"`);
      return;
    }

    consola.start(`[${LOGGER_NAMESPACE}] 执行 ${projectName} 的 ${scriptName} 脚本...`);

    return new Promise((resolve, reject) => {
      // 使用pnpm执行脚本
      const child = spawn('pnpm', ['run', scriptName], {
        cwd: projectPath,
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', (code) => {
        if (code === 0) {
          consola.success(`[${LOGGER_NAMESPACE}] 🎉 ${projectName} 的 ${scriptName} 脚本执行完成！`);
          resolve('success');
        } else {
          // consola.error(`[${LOGGER_NAMESPACE}] ${projectName} 的 ${scriptName} 脚本执行失败，退出码: ${code}`);
          // reject(new Error(`脚本执行失败，退出码: ${code}`));
          const err = new Error(`${projectName} 的脚本 ${scriptName} 失败，退出码: ${code}`);
          consola.error(`[${LOGGER_NAMESPACE}] ❌`, err);
          reject(err);
        }
      });

      child.on('error', (err) => {
        consola.error(`[${LOGGER_NAMESPACE}] ❌ 子进程执行出错:`, err);
        reject(err);
      });
    });
  };
}


/**
 * 从 YAML 文件中读取指定配置
 *
 * @param filePath YAML 文件路径
 * @param key 要读取的字段, 支持 nested key
 * @param defaultValue 默认值
 */
export function readYamlField<T>(
  filePath: string,
  key: string,
  defaultValue: T,
): T {
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  try {
    const parsed = yaml.parse(
      fs.readFileSync(filePath, 'utf8'),
    ) as Record<string, any>;

    const keys = key.split('.');

    let value: any = parsed;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return defaultValue;
      }
    }

    return value as T;
  } catch {
    return defaultValue;
  }
}


/**
 * 运行脚本
 * @param dir
 * @param script
 */
export function runScript(dir: string, script: string, options?: SpawnOptions) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['run', script], {
      cwd: dir,
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('exit', (code) => {
      if (code === 0)
        resolve();
      else
        reject(new Error(`exit code ${code}`));
    });
  });
}

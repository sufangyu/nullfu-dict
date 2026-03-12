export interface BaseTask {
  /**
   * 任务 id
   */
  id: string;
  /**
   * 依赖的任务 id
   */
  dependsOn?: string[];
  /**
   * 监听的文件
   */
  watch?: string[];
}


/**
 * 脚本任务
 * @description 运行 `package.json` scripts 命令构建
 */
export interface ScriptTask extends BaseTask {
  /**
   * 任务类型
   */
  type: 'script';
  /**
   * 项目名称
   * @description 主要用于寻找 `packages` 下 `package.json` 文件脚本
   */
  projectName: string;
  /**
   * 脚本名称
   */
  scriptName: string;
}


/**
 * 构建任务
 * @description 运行项目 `vite.config.ts` 文件构建
 */
export interface BuildTask extends BaseTask {
  /**
   * 任务类型
   */
  type: 'build';
  /**
   * 项目名称
   * @description 主要用于寻找 `packages` 下 ``vite.config.ts` 文件
   */
  projectName: string;
  /**
   * 构建模式
   * @type 'development' | 'production'
   */
  mode: 'development' | 'production';
  /**
   * 自定义 `vite.config.ts` 文件路径
   */
  viteConfigPath?: string;
}


/**
 * 运行脚本任务类型
 */
export type TaskItem = ScriptTask | BuildTask;


/**
 * package.json 的最小结构定义
 */
export interface PackageJson {
  name?: string;
  scripts?: Record<string, string>;
}

/**
 * 任务结构
 *
 * 每个任务对应一个子包中的 script
 */
export interface ScriptTaskNative {
  /** 子包名称（通常为目录名） */
  name: string;
  /** 子包目录 */
  dir: string;
  /** 要执行的 script 名 */
  script: string;
}

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { consola } from 'consola';
import glob from 'fast-glob';

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

export interface CopyFilesOptions {
  targets: Array<{
    src: string, // 源文件，可用 glob
    dest: string, // 目标目录
  }>;
}

export function copyFilesPlugin(options: CopyFilesOptions): Plugin {
  return {
    name: 'vite-plugin-copy-files-after-build',
    apply: 'build',

    async closeBundle() {
      consola.info('🚚 Copy plugin: 开始复制文件...');

      for (const target of options.targets) {
        const files = await glob(target.src, { absolute: true });
        if (files.length === 0) {
          consola.warn(`⚠️ 未匹配到文件: ${target.src}`);
          continue;
        }

        for (const file of files) {
          const fileName = path.basename(file);
          const destDir = path.resolve(target.dest);
          const destPath = path.join(destDir, fileName);

          await mkdir(destDir, { recursive: true });

          await copyFile(file, destPath);

          consola.success(`📦 复制成功: ${fileName}\n → ${destPath}`);
        }
      }

      consola.info('🎉 所有复制任务完成！');
    },
  };
}

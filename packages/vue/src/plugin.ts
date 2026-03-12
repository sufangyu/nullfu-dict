// 创建插件（支持全局配置）
import type { DictManagerOptions } from '@nullfu/dict-core';
import type { App } from 'vue';
import type { MultiDictOptions } from './types';
import { createDictManager } from '@nullfu/dict-core';
import { DictManagerKey } from './symbols';


// TODO: 在创建/注册字典插件时就定义好类型（命名空间级别）


/**
 * 创建/注册字典插件
 *
 * 支持：
 * - 单个命名空间模式
 * - 多多命名空间模式
 * - Devtools 自动集成（可选）
 *
 * @param options 配置项
 * @param canUseDevtools 是否可以使用 devtools
 * @type T 多命名空间配置
 * @returns 注册函数
 */
export function setupDictPlugin<T extends MultiDictOptions>(options: T, canUseDevtools: boolean = false) {
  return {
    install(app: App) {
      const managerMap = new Map<string, ReturnType<typeof createDictManager>>();
      const optionsMap = new Map<string, DictManagerOptions>();

      /**
       * 为 DictManagerOptions 注入 Devtools Hook
       *
       * 原理：
       * 当字典缓存发生变化时（onCacheChange 触发）
       * 主动通知 Devtools 刷新 Inspector 面板
       *
       * ⚠️ 仅在 canUseDevtools = true 时启用
       */
      const withDevtoolsHook = (opt: DictManagerOptions): DictManagerOptions => {
        if (!canUseDevtools) {
          return opt;
        }

        // 保留用户原有的 onCacheChange
        const original = opt.onCacheChange;
        return {
          ...opt,
          onCacheChange: (event) => {
            original?.(event);
            // 异步加载 Devtools 通知函数（避免打包进生产环境）
            import('./devtools').then(({ notifyDictDevtoolsUpdate }) => notifyDictDevtoolsUpdate());
          },
        };
      };

      /**
       * 兼容两种配置方式：
       *
       * 单命名空间：
       *    setupDictPlugin({ url: '/api/dict' })
       *
       * 多命名空间：
       *    setupDictPlugin({
       *      system: { url: '/api/system/dict' },
       *      business: { url: '/api/business/dict' }
       *    })
       */
      if (isMulti(options)) {
        Object.entries(options).forEach(([namespace, opt]) => {
          const finalOpt = withDevtoolsHook(opt);
          managerMap.set(namespace, createDictManager(finalOpt));
          optionsMap.set(namespace, finalOpt);
        });
      } else {
        // 单命名空间（默认命名为 default）
        const finalOpt = withDevtoolsHook(options);
        managerMap.set('default', createDictManager(finalOpt));
        optionsMap.set('default', finalOpt);
      }

      /**
       * 通过 provide 向全局注入：
       *
       * 在 useDict / useDictManager 中通过 inject 获取
       */
      app.provide(DictManagerKey, {
        managerMap,
        optionsMap,
      });


      /**
       * 注册 Devtools 插件
       *
       * ⚠️ 使用动态 import：
       * - 避免生产环境打包 devtools 代码
       * - 支持 tree-shaking
       */
      if (canUseDevtools) {
        import('./devtools').then(({ registerDictDevtools }) => {
          registerDictDevtools(app);
        });
      }
    },
  };
}


/**
 * 判断是否为多命名空间配置
 */
function isMulti(options: any): options is Record<string, DictManagerOptions> {
  return typeof options === 'object' && !('url' in options);
}


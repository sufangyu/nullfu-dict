import type { DictItemDefault, DictManagerOptions } from '@nullfux/dict-core';
import { createDictManager } from '@nullfux/dict-core';
import { inject } from 'vue';
import { DictManagerKey } from './symbols';


/**
 * 字典管理 Hooks
 *
 * @param namespaceOrOptions 命名空间 或 配置
 * @param localOptions 当前配置, 与注册时配置进行合并, 相同的项会覆盖
 */
export function useDictManager<
  TDict extends DictItemDefault = DictItemDefault,
  TResponse = any,
>(
  namespaceOrOptions?: string | Partial<DictManagerOptions<TDict, TResponse>>,
  localOptions?: Partial<DictManagerOptions<TDict, TResponse>>,
): ReturnType<typeof createDictManager<TDict, TResponse>> {
  const context = inject(DictManagerKey) as
    | {
      managerMap: Map<string, DictManagerOptions<TDict, TResponse> & any>,
      optionsMap: Map<string, DictManagerOptions<TDict, TResponse>>,
    }
    | undefined; ;


  // 没有全局实例 → 必须传 localOptions
  if (!context) {
    return createDictManager(localOptions as DictManagerOptions<TDict, TResponse>);
  }

  let namespace = 'default';
  let override: Partial<DictManagerOptions<TDict, TResponse>> | undefined;


  if (typeof namespaceOrOptions === 'string') {
    namespace = namespaceOrOptions;
    override = localOptions;
  } else {
    override = namespaceOrOptions;
  }

  const baseOptions = context.optionsMap.get(namespace);
  const baseManager = context.managerMap.get(namespace);

  if (!baseOptions || !baseManager) {
    throw new Error(`[DictManager] 未找到 namespace: ${namespace}`);
  }

  if (!override) {
    return baseManager;
  }


  if (!context && !localOptions) {
    throw new Error('[DictManager] 请先 app.use(setupDictPlugin()) 或传入配置');
  }

  const mergedOptions = {
    ...baseOptions,
    ...override,
  };

  return createDictManager(mergedOptions);
}


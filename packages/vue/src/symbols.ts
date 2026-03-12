// 创建 Injection Key
import type { createDictManager, DictManagerOptions } from '@nullfux/dict-core';
import type { InjectionKey } from 'vue';

/**
 * 字典上下文（支持命名空间）
 */
export interface DictNamespaceContext {
  managerMap: Map<string, ReturnType<typeof createDictManager>>;
  optionsMap: Map<string, DictManagerOptions>;
}

export const DictManagerKey: InjectionKey<DictNamespaceContext> = Symbol('DictManager');

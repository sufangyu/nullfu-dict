import type { DictManagerOptions } from '@nullfu/dict-core';
import type { Ref } from 'vue';

/**
 * 支持单命名空间或多命名空间的配置
 */
export type MultiDictOptions<TNamespaces extends string = string>
  = | DictManagerOptions
    | Record<TNamespaces, DictManagerOptions>;


/**
 * 正常类型 或 ref 响应式包裹
 */
export type MaybeRef<T> = T | Ref<T>;


/**
 * 自动提取 code 类型（支持单个字符串或数组）
 */
export type DictCodes<C>
  = C extends string
    ? C
    : C extends readonly (infer R)[]
      ? R extends string
        ? R
        : never
      : never;

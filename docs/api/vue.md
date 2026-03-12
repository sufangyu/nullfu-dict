# @nullfux/dict-vue

Vue Hooks API 介绍。

### API

### `setupDictPlugin<T extends MultiDictOptions>(options: T, canUseDevtools?: boolean)`

创建/注册字典插件, 支持单个/多个命名空间

**范型**

- `TDict`: 字典数据类型
- `TResponse`: 接口返回的数据类型

**options 的API如下：**
| 字段             | 说明                                                                                    | 类型               | 默认    |
|------------------|-----------------------------------------------------------------------------------------|--------------------|---------|
| `options`        | 配置项, 支持单个配置或者多个命名空间的配置。具体配置项可查看核心库的`DictManagerOptions` | `MultiDictOptions` | —       |
| `canUseDevtools` | 是否允许使用 vue devtools                                                               | `boolean`          | `false` |


### `useDict(code: MaybeRef<C>, options?: {namespace?: string, immediate?: boolean, fetchDictOptions?: FetchDictOptions, dictManagerOptions?: Partial<DictManagerOptions<T>>, onFetchDictError?: (status: number, message: string, error: HTTPError) => void})`

字典 hooks, 具体方法介绍如下：

```ts
export function useDict<
  T extends Record<string, any> = DictItemDefault,
  C extends string | readonly string[] = string
>(code: MaybeRef<C>, options?: {
  namespace?: string,
  immediate?: boolean,
  fetchDictOptions?: FetchDictOptions,
  dictManagerOptions?: Partial<DictManagerOptions<T>>,
  onFetchDictError?: (status: number, message: string, error: HTTPError) => void,
});
```

**范型**

- `T`: 字典数据类型
- `C`: 字典 code

**参数**
| 字段                      | 说明                             | 类型                                                          | 默认      |
|---------------------------|----------------------------------|---------------------------------------------------------------|-----------|
| `code`                    | 字典编码                         | `MaybeRef<T>`                                                 | —         |
| `code.namespace`          | 命名空间                         | `string`                                                      | `default` |
| `code.immediate`          | 是否立即执行                     | `boolean`                                                     | `true`    |
| `code.fetchDictOptions`   | 字典请求配置                     | `FetchDictOptions`                                            | `true`    |
| `code.dictManagerOptions` | 字典管理配置, 会覆盖注册时的配置 | `FetchDictOptions`                                            | —         |
| `code.onFetchDictError`   | 字典请求错误回调                 | `(status: number, message: string, error: HTTPError) => void` | —         |


## Types

```ts
import type { DictManagerOptions } from '@nullfux/dict-core';
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

```

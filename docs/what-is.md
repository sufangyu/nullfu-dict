# 📘 DictManager — 字典请求与缓存管理器

一个用于字典数据请求合并、缓存、重试、降级、LRU 管理 的高性能工具，适用于后台配置字典、状态枚举、选项列表等场景。


## ✨ 核心能力

| 能力          | 说明                                               |
|---------------|----------------------------------------------------|
| 🚀 请求合并   | mergeDelay 窗口内的多个字典请求自动合并为一次 HTTP |
| 🧠 LRU 缓存   | 支持最大缓存条数 + 最近最少使用淘汰                |
| ⏳ 过期控制    | cacheTime 控制缓存过期时间                         |
| 🔁 SWR 模式   | 过期数据先返回旧值，再后台刷新                      |
| 🧯 降级容错   | 请求失败可自动回退到缓存数据                       |
| 🔄 自动重试   | 支持失败重试与自定义重试条件                       |
| ✋ 可取消请求  | 支持取消未发出请求 + 进行中请求                    |
| 🔌 拦截器     | 支持请求和响应拦截                                 |
| 🧩 可定制解析 | 可自定义响应结构和字典解析逻辑                     |


## 🏗 如何使用

```ts
const dictManager = createDictManager<TDict, TResponse>({
  url: '/api/dict',
});

// 单个字典
await dictManager.fetchDict('DICT_ONE');

// 多个字典
await dictManager.fetchDict('DICT_ONE', 'DICT_SECOND');
```


## ⚙️ 配置项

### 🧩 一、基础请求配置

| 字段                  | 说明                                             | 默认         |
|-----------------------|--------------------------------------------------|--------------|
| `url`                 | 接口地址                                         | —            |
| `method`              | HTTP 请求方法                                    | `'post'`     |
| `headers`             | 自定义请求头                                     | —            |
| `fieldName`           | 提交字典 code 的字段名                           | `'codes'`    |
| `dictCodeKey`         | 接口返回数据中标识字典 code 的字段名             | `'dictCode'` |
| `requestFn`           | 自定义请求函数（可适配 XMLHttpRequest / axios 等） | 内置 fetch   |
| `requestInterceptor`  | 请求发送前拦截                                   | —            |
| `responseInterceptor` | 响应返回后拦截                                   | —            |
| `isSuccess`           | 判断接口是否成功                                 | 内置解析     |
| `parseResponseData`   | 从响应中提取“字典列表”                           | 内置解析     |
| `parseDict`           | 从字典列表中提取指定 code 的字典数据             | 内置解析     |


### 🧱 二、缓存系统（LRU + SWR）

| 字段                | 说明                      | 默认    |
|---------------------|---------------------------|---------|
| `cache`             | 是否启用缓存              | `true`  |
| `cacheTime`         | 缓存有效时间（毫秒）        | `1小时` |
| `maxCacheSize`      | 最大缓存条数（LRU 淘汰）    | `100`   |
| `disabledCacheCodes` | 指定不参与缓存的字典 code | `[]`    |

**缓存策略说明**
| 状态              | 行为                                 |
|-------------------|--------------------------------------|
| 命中缓存 + 未过期 | 直接返回缓存，并刷新 LRU 顺序         |
| 命中缓存 + 已过期 | **立即返回旧数据（SWR）**，后台自动刷新 |
| 未命中缓存        | 加入合并请求队列                     |


### 🚀 三、请求合并机制

| 字段         | 说明             | 默认   |
|--------------|------------------|--------|
| `mergeDelay` | 请求合并窗口时间 | `25ms` |

**机制说明**
在 `mergeDelay` 时间内的多个 `fetchDict()` 调用将被合并为一次请求：
```base
fetchDict('A')
fetchDict('B')
fetchDict('C')
      ↓
  25ms 内合并
      ↓
请求一次接口 { codes: ['A','B','C'] }
```
> ⚠️ 不建议超过 50ms，否则用户可能感觉接口延迟


### 🔁 四、重试机制

| 字段         | 说明                         | 默认             |
|--------------|------------------------------|------------------|
| `retry`      | 失败自动重试次数             | `0`              |
| `retryDelay` | 每次重试间隔                 | `200ms`          |
| `retryOn`    | 自定义是否触发重试的判断函数 | 内置网络错误判断 |

**适合解决：**
- 瞬时网络抖动
- 弱网环境
- 移动端超时问题


### 🛟 五、失败降级策略

| 字段              | 说明                     | 默认   |
|-------------------|--------------------------|--------|
| `fallbackOnError` | 请求失败时是否返回旧缓存 | `true` |

| 场景     | 行为           |
|----------|----------------|
| 有旧缓存 | 返回旧缓存数据 |
| 无缓存   | Promise reject |


### 💡 六、最佳实践建议
| 建议                   | 原因                        |
|------------------------|-----------------------------|
| `mergeDelay` 20–30ms   | 平衡合并效率与响应速度      |
| `cacheTime` ≥ 10min    | 字典数据通常不频繁变更      |
| `maxCacheSize` 50–200  | 防止内存增长                |
| 开启 `fallbackOnError` | 提高系统稳定性              |
| 开启 `retry=1~2`       | 适配接口不稳定 / 移动端网络 |


## 🧬 流程

```base
createDictManager
   ↓
fetchDict
   ↓
缓存命中? —— 是 → 直接返回
   ↓ 否
请求合并队列
   ↓ 25ms 内合并
HTTP 请求
   ↓
请求拦截?
   ↓
发起请求 —— 默认`fetch`, 支持自定义实现请求
   ↓
响应拦截?
   ↓
isSuccess? —— 默认`(res) => res && res.success !== false`
   ↓
提取字典数据?  —— 默认`(res) => res.data`
   ↓
解析获取字典数据?  —— 默认`(dictList, code, codeKey) => dictList.find(it => it[codeKey] === code)`
   ↓
缓存 → 唤醒所有等待者
```


## 🧩 内置工具函数

这些工具函数用于 字典数据处理、树结构转换、选项映射、格式化显示。

### transformToOptions

**作用**
将 枚举 / 普通对象 转换为 UI 组件可用的 options 结构。

**参数说明**
| 参数                     | 类型                     | 默认值    | 说明                    |
|--------------------------|--------------------------|-----------|-------------------------|
| `data`                   | `Record<string, any>`    | —         | 枚举或对象数据源        |
| `options.labelKey`       | `string`                 | `'label'` | 输出对象的 label 字段名 |
| `options.valueKey`       | `string`                 | `'value'` | 输出对象的 value 字段名 |
| `options.transformLabel` | `(key, value) => string` | —         | 自定义 label 文案转换   |
| `options.transformValue` | `(value, key) => any`    | —         | 自定义 value 转换       |

**示例**
```ts
enum Status {
  ENABLE = 1,
  DISABLE = 0,
}

transformToOptions(Status);
/*
[
  { label: 'ENABLE', value: 1 },
  { label: 'DISABLE', value: 0 }
]
*/

transformToOptions(Status, {
  transformLabel: k => k === 'ENABLE' ? '启用' : '禁用'
});
/*
[
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]
*/
```
> ⚠️ 注意: 针对枚举会过滤数字 key, 避免生成重复 option。


### getDictItems

**作用**
获取字典数据列表，支持 禁用过滤、树形结构转换。

**参数说明**
| 参数                  | 类型                | 默认值       | 说明                           |
|-----------------------|---------------------|--------------|--------------------------------|
| `dict`                | `RecordBase`        | —            | 字典完整数据                   |
| `options.childrenKey` | `string`            | `'children'` | 子节点字段名                   |
| `options.isEnable`    | `boolean`           | `false`      | 是否只返回启用数据             |
| `options.enableKey`   | `string`            | `'isEnable'` | 启用字段名，值为 `'1'` 代表启用 |
| `options.enable`      | `(item) => boolean` | —            | 自定义启用判断（优先级最高）     |
| `options.withTree`    | `boolean`           | `false`      | 是否返回树形结构               |

**示例**
```ts
const dict = {
  children: [
    { dictCode: '1', dictName: '男', isEnable: '1' },
    { dictCode: '2', dictName: '女', isEnable: '0' }
  ]
};

getDictItems(dict, { isEnable: true });
```


### getDictLabel

**作用**
根据字典值获取显示 label。

**参数说明**
| 参数                  | 类型                       | 默认值       | 说明           |
|-----------------------|----------------------------|--------------|----------------|
| `value`               | `string \| number \| null` | —            | 字典值         |
| `dictList`            | `T[]`                      | —            | 字典列表       |
| `options.labelKey`    | `string`                   | `'dictName'` | label 字段名   |
| `options.valueKey`    | `string`                   | `'dictCode'` | value 字段名   |
| `options.placeholder` | `string`                   | `'-'`        | 未匹配时占位符 |

**示例**
```ts
const dictList = [{ label: '男', value: '1' }];

getDictLabel('1', dictList);
// → "男"
```


### getOptionLabel

**作用**
根据 options 列表获取 label（UI 场景常用）。

**参数说明**
| 参数                  | 类型                       | 默认值    | 说明         |
|-----------------------|----------------------------|-----------|--------------|
| `value`               | `string \| number \| null` | —         | 值           |
| `list`                | `{label,value}[]`          | —         | options 列表 |
| `options.labelKey`    | `string`                   | `'label'` | label 字段   |
| `options.valueKey`    | `string`                   | `'value'` | value 字段   |
| `options.placeholder` | `string`                   | `'-'`     | 未匹配占位   |

**示例**
```ts
const optionsList = [{ label: '男', value: '1' }];

getOptionLabel(1, optionsList);
// → "男"
```


### listToTree

**作用**
扁平列表 → 树结构。

**参数说明**
| 参数                     | 类型              | 默认值       | 说明            |
|--------------------------|-------------------|--------------|-----------------|
| `list`                   | `TData[]`         | —            | 原始列表数据    |
| `options.idKey`          | `string`          | `'id'`       | 节点 id 字段    |
| `options.parentIdKey`    | `string`          | `'parentId'` | 父节点 id 字段  |
| `options.labelRawKey`    | `string`          | `'dictName'` | 源 label 字段   |
| `options.valueRawKey`    | `string`          | `'dictCode'` | 源 value 字段   |
| `options.disabledRawKey` | `string`          | `'isEnable'` | 源启用字段      |
| `options.labelKey`       | `string`          | `'label'`    | 输出 label 字段 |
| `options.valueKey`       | `string`          | `'value'`    | 输出 value 字段 |
| `options.childrenKey`    | `string`          | `'children'` | 子节点字段      |
| `options.disabledKey`    | `string`          | `'disabled'` | 输出禁用字段    |
| `options.enable`         | `(item)=>boolean` | —            | 启用判断函数    |
| `options.maxLevel`       | `number`          | —            | 最大层级        |
| `options.cleanSource`    | `boolean`         | `true`       | 删除源字段      |

**示例**
```ts
const list = [
  { id: '1', parentId: '', dictName: '根1' },
  { id: '1-1', parentId: '1', dictName: '根1-子1' },
  { id: '1-2', parentId: '1', dictName: '根1-子2' },
  { id: '2', parentId: '', dictName: '根2' },
  { id: '2-1', parentId: '2', dictName: '根2-子1' },
  { id: '2-2', parentId: '2', dictName: '根2-子2' },
];

listToTree(list);
/*
[
  {
    id:'1',
    parentId: '',
    dictName:'根1',
    children:[
      { id: '1-1', parentId: '1', dictName: '根1-子1' },
      { id: '1-2', parentId: '1', dictName: '根1-子2' },
    ],
  },
  {
    id:'2',
    parentId: '',
    dictName:'根-2',
    children:[
      { id: '2-1', parentId: '2', dictName: '根2-子1' },
      { id: '2-2', parentId: '2', dictName: '根2-子2' },
    ],
  },
]
*/

```

### treeToArray
**作用**
树结构 → 扁平数组，自动添加层级与父子关系。

**参数说明**
| 参数                     | 类型      | 默认值       | 说明             |
|--------------------------|-----------|--------------|------------------|
| `tree`                   | `TData[]` | —            | 树结构数据       |
| `options.labelRawKey`    | `string`  | `'label'`    | 源 label 字段    |
| `options.valueRawKey`    | `string`  | `'value'`    | 源 value 字段    |
| `options.disabledRawKey` | `string`  | `'disabled'` | 源禁用字段       |
| `options.childrenRawKey` | `string`  | `'children'` | 源 children 字段 |
| `options.labelKey`       | `string`  | `'label'`    | 输出 label 字段  |
| `options.valueKey`       | `string`  | `'value'`    | 输出 value 字段  |
| `options.disabledKey`    | `string`  | `'disabled'` | 输出禁用字段     |
| `options.levelKey`       | `string`  | `'level'`    | 层级字段         |
| `options.parentKey`      | `string`  | `'parentId'` | 父节点字段       |
| `options.idKey`          | `string`  | `'id'`       | 节点 id 字段     |
| `options.maxLevel`       | `number`  | —            | 最大展开层级     |
| `options.cleanSource`    | `boolean` | `true`       | 删除源字段       |

**示例**
```ts
const tree = [
  {
    id: '1',
    label: '根',
    children: [
      {
        id: '1-1',
        label: '子',
      }
    ],
  }
];

treeToArray(tree);
/*
[
  { id:'1', label:'根', level:1, parentId:'' },
  { id:'1-1', label:'子', level:2, parentId:'1' }
]
*/
```

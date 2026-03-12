# 工具函数

`@nullfu/dict-core` 提供了一些工具函数，用于字典数据处理。


## `getDictItems<TDictItem, CKey>(dict, options?)`

获取某一字典配置的具体字典列表数据。

**范型**

- `TDictItem`: 字典项数据类型
- `CKey`: 子项数字段名

**参数**

| 参数                  | 说明           | 类型                        | 默认值                                                 |
|-----------------------|----------------|-----------------------------|--------------------------------------------------------|
| `dict`                | 字典数据       | `Record<string, TDictItem>` | —                                                      |
| `options.childrenKey` | 数据字段名     | `string`                    | `children`                                             |
| `options.disabledKey` | 禁用字段名     | `string`                    | `disabled`                                             |
| `options.enabledKey`  | 可用字段名     | `string`                    | `enabled`                                              |
| `options.enabledOnly` | 只返回启用项   | `boolean`                   | `false`                                                |
| `options.enabledOn`   | 自定义启用判断 | `(item) => boolean`         | `item[enabledKey]='1' \|\| item[disabledKey] === true` |


**示例：**

下面示例中, `getDictItems`实际获取的数据是`children`下的数据。

<demo vue="./demo-code/utils/demo-01.vue"/>


## `getDictLabel<TDictItem>(value, dictList, options?)`

根据字典的编码获取 label 文本。

| 参数                  | 说明         | 类型               | 默认值  |
|-----------------------|--------------|--------------------|---------|
| `value`               | 字典编码值   | `string \| number` | —       |
| `dictList`            | 字典列表数据 | `TDictItem`        | —       |
| `options.labelKey`    | 标签 key     | `string`           | `label` |
| `options.valueKey`    | 字典编码 key | `string`           | `value` |
| `options.placeholder` | 空值占位符   | `string`           | `-`     |

**示例**

<demo vue="./demo-code/utils/demo-02.vue" />


## `listToTree<TDictItem, TNodeItem>(list, options?)`

扁平列表数据转树结构数据。

**范型**
- `TDictItem`: 字典项数据类型
- `TNodeItem`: 树节点数据类型

**参数**

| 参数                     | 说明                       | 类型                           | 默认值                                                       |
|--------------------------|----------------------------|--------------------------------|--------------------------------------------------------------|
| `list`                   | 数据列表                   | `TDictItem[]`                  | —                                                            |
| `options.idKey`          | id 源字段名                | `string`                       | `id`                                                         |
| `options.parentIdKey`    | 父级 id 源字段名           | `string`                       | `parentId`                                                   |
| `options.labelRawKey`    | label 源字段名             | `string`                       | `label`                                                      |
| `options.valueRawKey`    | value 源字段名             | `string`                       | `value`                                                      |
| `options.enabledRawKey`  | 可用源字段名               | `string`                       | `enabled`                                                    |
| `options.disabledRawKey` | 禁用源字段名               | `string`                       | `disabled`                                                   |
| `options.labelKey`       | label 结果字段名           | `string`                       | `label`                                                      |
| `options.valueKey`       | value 结果字段名           | `string`                       | `value`                                                      |
| `options.disabledKey`    | 输出启用字段名             | `string`                       | `disabled`                                                   |
| `options.childrenKey`    | 子项数据结果字段名         | `string`                       | `children`                                                   |
| `options.enabledOn`      | 自定义启用判断             | `(item: TDictItem) => boolean` | `item[enabledRawKey]='1' \|\| item[disabledRawKey] === true` |
| `options.maxLevel`       | 最大层级, 不设置表示无限制 | `number`                       | `—`                                                          |
| `options.cleanSource`    | 映射后删除源字段           | `boolean`                      | `true`                                                       |


**示例**

<demo vue="./demo-code/utils/demo-03.vue" />


## `treeToArray<TNodeItem, TDictItem>(list, options?)`

树结构数据转扁平数组数据。

**范型**

- `TNodeItem`: 树节点数据类型
- `TDictItem`: 返回字典结果数据类型

**参数**

| 参数                     | 说明                | 类型                                                                    | 默认值     |
|--------------------------|---------------------|-------------------------------------------------------------------------|------------|
| `tree`                   | 树结构数据          | `TNodeItem[]`                                                           | —          |
| `options.idKey`          | id 字段名           | `string`                                                                | `id`       |
| `options.labelRawKey`    | label 源字段名      | `string`                                                                | `label`    |
| `options.valueRawKey`    | value 源字段名      | `string`                                                                | `value`    |
| `options.disabledRawKey` | disabled 源字段名   | `string`                                                                | `disabled` |
| `options.childrenRawKey` | children 源字段名   | `string`                                                                | `children` |
| `options.labelKey`       | label 结果字段名    | `string`                                                                | `label`    |
| `options.valueKey`       | value 结果字段名    | `string`                                                                | `value`    |
| `options.disabledKey`    | disabled 结果字段名 | `string`                                                                | `disabled` |
| `options.childrenKey`    | children 结果字段名 | `string`                                                                | `children` |
| `options.levelKey`       | level 结果字段名    | `string`                                                                | `level`    |
| `options.parentKey`      | parent 结果字段名   | `string`                                                                | `parentId` |
| `options.idKey`          | id 字段名           | `string`                                                                | `id`       |
| `options.transformer`    | 转换器, 可扩展处理  | `(node: TNodeItem, dictItem: TDictItem, cleanSource?: boolean) => void` | `—`        |
| `options.maxLevel`       | 最大层级            | `number`                                                                | `—`        |
| `options.cleanSource`    | 映射后删除源字段    | `boolean`                                                               | `true`     |

**示例**

<demo vue="./demo-code/utils/demo-04.vue" />


## `transformToOptions<TData, KLabel, KValue>(data, options?)`

将枚举 或 普通对象转换为选项数据列表数据。

**范型**

- `TData`: 源数据类型
- `KLabel`: label 结果字段名
- `KValue`: value 结果字段名
- `TExtra`: 额外属性

**参数**

| 参数                     | 说明                 | 类型                                  | 默认值  |
|--------------------------|----------------------|---------------------------------------|---------|
| `data`                   | 树结构数据           | `TData ｜ Record<string, any>`         | —       |
| `options.labelKey`       | label 字段名         | `KLabel ｜ string`                     | `label` |
| `options.valueKey`       | value 字段名         | `KValue ｜ string`                     | `value` |
| `options.transformLabel` | label 转换函数       | `(key, value) => string`              | —       |
| `options.transformValue` | value 转换函数（可选） | `(value, key) => string`              | —       |
| `options.extra`          | 额外属性             | `(value, key) => Record<string, any>` | —       |


**示例**

<demo vue="./demo-code/utils/demo-05.vue" />

:::tip
`transformLabel`, `transformValue` 在需要转换 label 或 value 的值时使用, 甚至添加额外的属性。

如下面示例代码, 通过`transformLabel`把`label`是`禁用`的文案改成`停用`, 通过`transformValue`把`value`改为数字类型, 通过`extra`添加额外的属性。

```ts
const STATUS_OBJ = {
  启用: '1',
  禁用: '0',
};

const options = transformToOptions(STATUS_OBJ, {
  transformLabel: (key, value) => {
    if (key === '禁用') {
      return '停用';
    }
    return key;
  },
  transformValue: (value, key) => {
    return Number(value);
  },
  extra: (key, value) => {
    return {
      disabled: value === '0',
    };
  }
});


// 没加转换器的结果:
// [
//   { label: '启用', value: '1' },
//   { label: '禁用', value: '0' },
// ]

// 加转换器的结果:
// [
//   { label: '启用', value: 1, disabled: false },
//   { label: '停用', value: 0}, disabled: true },
// ]
```
:::


## `getOptionLabel<TData>(value, list, options?)`

获取选项的 label 文案。

**范型**

- `TData`: 源数据类型

**参数**

| 参数                  | 说明           | 类型                              | 默认值  |
|-----------------------|----------------|-----------------------------------|---------|
| `value`               | 值             | `string \| number`                | —       |
| `list`                | 数据列表       | `(TData ｜ Record<string, any>)[]` | —       |
| `options.labelKey`    | label 转换函数 | `keyof TData`                     | `label` |
| `options.valueKey`    | label 转换函数 | `keyof TData`                     | `value` |
| `options.placeholder` | 空值占位符     | `string`                          | `-`     |

**示例**

```ts
const options = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' },
];

const label = getOptionLabel('1', options);
console.log(label);
// 打印结果是: 启用
```

> 示例代码可以查看 API - `transformToOptions`中的示例。

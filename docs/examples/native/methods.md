# 常用方法

通过`createDictManager`创建的字典管理器提供一些常用的方法, 具体如下:


## 获取字典数据

`fetchDict(code[, fetchOptions])`

**参数**

- `code`: 字典编码, 支持单个或多个字典编码, 多个时传入数组
- `fetchOptions.disableCache`: 强制不使用缓存

**返回值: 字典数据对象结果, key 是字典编码**

```ts{5}
const dictManager = createDictManager({
  // 配置项...
});

const res = await dictManager.fetchDict('DICT_FIRST');
console.log('DICT_FIRST::', res);
// 打印结果:
// {
//   DICT_FIRST: {
//     // 字典数据...
//   }
// }
```


## 取消请求

`cancelFetch([reason])`

**参数**

- `reason`: 取消请求的原因

```ts{5}
const dictManager = createDictManager({
  // 配置项...
});

dictManager.cancelFetch();
```


## 删除缓存的字典

`deleteCache(code)`

**参数**

- `code`: 字典编码, 支持单个或多个字典编码, 多个时传入数组

```ts{6,9}
const dictManager = createDictManager({
  // 配置项...
});

// 单个
dictManager.deleteCache('DICT_FIRST');

// 多个
dictManager.deleteCache(['DICT_FIRST', 'DICT_SECOND']);
```


## 清除所有缓存

`clearCache()`

```ts{5}
const dictManager = createDictManager({
  // 配置项...
});

dictManager.clearCache();
```

## 获取字典数据列表

`getDictCache(code)`

**参数**

- `code`: 字典编码

**返回值: 缓存中的字典数据信息**

```ts{7}
const dictManager = createDictManager({
  // 配置项...
});

await dictManager.fetchDict('DICT_FIRST');

const cacheDict = dictManager.getDictCache('DICT_FIRST');
console.log(cacheDict);
// 打印结果:
// {
//   data: {
//     // 实际字典数据
//   },
//   expireAt: 1772682397923, // 过期时间
// }
```


## 获取缓存字典数量

`getCacheSize`

**返回值: 字典缓存数量**

```ts{5}
const dictManager = createDictManager({
  // 配置项...
});

const cacheSize = dictManager.getCacheSize();
console.log('cacheSize::', cacheSize);
// 打印结果: 5
```


## 获取缓存字典 keys

`getCacheKeys`

**返回值: 字典缓存 keys, 即字典编码编码集合**

```ts{5}
const dictManager = createDictManager({
  // 配置项...
});

const cacheKeys = dictManager.getCacheKeys();
console.log('cacheKeys::', cacheKeys);
// 打印结果: ['DICT_FIRST', 'DICT_SECOND']
```


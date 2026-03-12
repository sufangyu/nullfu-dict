# 基础使用

`useDict` 才是实际的字典数据获取方法, 使用方式如下:

```ts
const code = 'DICT_STYLES';
const { loading, data, dictMap } = useDict(code);
```


## 演示

### 基础使用

通过`createDictManager`创建管理器后, 使用管理器的`fetchDict`方法获取字典数据。

```ts
import { createDictManager } from '@nullfu/dict-core';

const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});

const res = await dictManager.fetchDict('DICT_FIRST');
console.log('DICT_FIRST', res);
```
<demo vue="./demo-code/base/demo-01.vue"/>



### 查询多个字典

`fetchDict` 支持查询一次性查询多个字典, 只需要传入字典编码数组, 使用方式如下:

```ts
const res = await dictManager.fetchDict(['DICT_STYLES', 'DICT_REASON']);
```

此时, 查询字典结果数据会返回一个对象, 对象的键为字典编码, 值为字典数据。

<demo vue="./demo-code/base/demo-02.vue"/>

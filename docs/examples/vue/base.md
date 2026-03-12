# 基础使用

`useDict` 才是实际的字典数据获取方法, 使用方式如下:

```ts
const code = 'DICT_STYLES';
const { loading, data, dictMap } = useDict(code);
```


## 演示

### 基础使用

<demo vue="./demo-code/base/demo-01.vue"/>


### 手动获取

字段默认是主动发起请求获取数据, 可以通过设置`immediate`为`false`禁止主动获取数据, 再合适时机调用`load`方法手动获取字典数据。

```ts{4,10}
<script lang="tsx" setup>
const code = 'DICT_FIRST';
const { loading, data, dictMap, load } = useDict(codes, {
  immediate: false,
});
</script>

<template>
  // some code
  <ElButton type="primary" @click="load">获取字典</ElButton>
</template>
```

<demo vue="./demo-code/base/demo-02.vue" />


### 查询多个字典

`useDict` 支持查询多个字典, 使用方式如下:

```ts{1,2}
// 使用 as const 才会把数组当作 只读元组（readonly tuple）
const codes = ['DICT_STYLES', 'DICT_REASON'] as const;

const { loading, data, dictMap } = useDict(codes);
```

<demo vue="./demo-code/base/demo-03.vue" />

::: tip
`useDict`也支持数组的字典编码, 在使用数组时, 建议使用`as const`, 从而使用`dictMap`获取具一字典数据时有响应的字典编码提示。
:::


### 合并请求

`useDict`在多次使用获取字典数据时, 同一命名空间的会自动合并请求, 如下面代码中, `DICT_OTHER`和`[DICT_STYLES, DICT_REASON]`会被合并请求。

而`DICT_EXTERNAL`是属于命名空间 external 的字典, 会与默认命名空间分开单独一个请求。

```ts
// 内部字典
const code = 'DICT_OTHER';
const codes = ['DICT_STYLES', 'DICT_REASON'] as const;
const { loading, data, dictMap } = useDict(codes);
const {
  loading: loadingForOther,
  data: dataForOther,
  dictMap:
  dictMapForOther
} = useDict(code);

// 外部字典
const codeExternal = 'DICT_EXTERNAL';
const {
  loading: loadingForExternal,
  data: dataForExternal,
  dictMap: dictMapForExternal
} = useDict(codeExternal, {
  namespace: 'external',
});
```

::: tip
默认合并请求的间隔为`25ms`
:::

<demo vue="./demo-code/base/demo-04.vue" />

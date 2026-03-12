# 命名空间

项目中可能会出现来自不同系统的字典数据源, 这样可能会存在不同的字典数据源会有不同的配置项, 为了避免命名冲突, 此时可以使用命名空间。

> 没使用命名空间时, 实际上会把配置项设置给`default`的命名空间, 当使用`useDict`时没指定命名空空间时也会使用`default`的命名空间的配置项。

## 使用

### 注册插件
```ts
import { setupDictPlugin } from '@nullfux/dict-vue';

app.use(
  setupDictPlugin({
    default: {
      baseURL: 'http://localhost:5173',
      url: '/api/dict',
    },
    external: {
      baseURL: 'http://localhost:5173',
      url: '/api/external-dict'
    },
  })
);
```

### 指定命名空间字典
```ts
// 使用 as const 才会把数组当作 只读元组（readonly tuple）
const codes = ['DICT_STYLES', 'DICT_REASON'] as const;

const { loading, data, dictMap } = useDict(codes, { namespace: 'external' });
console.info(loading, data, dictMap);
```


## 演示

### 基础使用

`useDict` 支持指定命名空间, 指定后会使用对应的命名空间配置项。

<demo vue="./demo-code/namespace/demo-01.vue"/>


### 高级使用

命名空间的使用也支持`fetchDict`方法中的配置项覆盖全局配置项。像下面例子覆盖`setupDictPlugin`时的`url`配置。

```ts{3-5}
const { loading, data, dictMap } = useDict('DICT_REASON', {
  namespace: 'external',
  dictManagerOptions: {
    url: '/api/external-dict-overwrite'
  },
  onFetchDictError: (status, message, _error) => ElMessage.error({ message: `[${status}] ${message}`, grouping: true })
});
```

<demo vue="./demo-code/namespace/demo-02.vue" />

::: tip
覆盖的`url: '/api/external-dict-overwrite'`没有配置响应的接口, 会导致接口请求404, 从而触发`onFetchDictError`方法。
:::


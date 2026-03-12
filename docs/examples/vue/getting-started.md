# 快速开始


## 安装

可以使用以下方式安装它：

::: code-group

```sh [npm]
$ npm install @nullfu/dict-vue
```

```sh [pnpm]
$ pnpm add @nullfu/dict-vue
```

```sh [yarn]
$ yarn add @nullfu/dict-vue
```

:::


## 注册插件

```ts
import { setupDictPlugin } from '@nullfu/dict-vue';

const app = createApp(App);

app.use(setupDictPlugin({
  baseURL: 'https://api.demo.com',
  url: '/api/dict',
}));

app.mount('#app');
```


## 组件中使用

```vue
<script setup lang="ts">
import { useDict } from '@nullfu/dict-vue';

const code = 'DICT_REASON';
const { loading, data, dictMap } = useDict(code);
/**
 * loading: 加载状态
 * data: 字典数据
 * dictMap: 当前字典
 */
</script>

<template>
  <div>加载状态: {{ loading }}</div>
  <div>接口字典数据: {{ data }}</div>
  <div>指定字典数据: {{ dictMap?.[code] }}</div>
</template>
```


## Hooks 的架构

从底层开始看, Dict Hooks 大致架构如下:

```base
core 层        → createDictManager
plugin 层      → setupDictPlugin → 全局配置(支持命名空间)
hook 层        → useDict → 通过`useDictManager`创建`manager`(支持覆盖全局配置项)
```

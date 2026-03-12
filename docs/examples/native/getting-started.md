# 快速开始


## 安装

可以使用以下方式安装它：

::: code-group

```sh [npm]
$ npm install @nullfux/dict-core
```

```sh [pnpm]
$ pnpm add @nullfux/dict-core
```

```sh [yarn]
$ yarn add @nullfux/dict-core
```

:::



## 使用

```ts
import { createDictManager } from '@nullfux/dict-core';

const dictManager = createDictManager<TDict, TResponse>({
  url: '/api/dict',
});

// 单个字典
await dictManager.fetchDict('DICT_ONE');

// 多个字典
await dictManager.fetchDict('DICT_ONE', 'DICT_SECOND');
```

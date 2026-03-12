# 合并请求

多次使用同步的`fetchDict`获取字典数据时, 在合并请求的间隔时间范围内会自动合并同一个请求。

::: tip
默认合并请求的间隔为`25ms`
:::

## 演示

### 合并请求

演示`await`同步请求、合并窗口内的请求以及合并窗口外的请求场景。

```ts
// 1. 等待完成才会请求后续
await getDictFirst();

// 2. 异步请求 & 在合并请求窗口内的延迟请求, 会被合并
getDictStyles();
getDictReason();
setTimeout(() => getDictMulti(), 10);

// 3. 在合并请求窗口外的延迟请求, 会单独一个请求
setTimeout(() => getDictAlone(), 1250);
```

<demo vue="./demo-code/merge-request/demo-01.vue"/>



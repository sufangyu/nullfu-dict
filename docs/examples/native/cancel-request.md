# 取消请求

在未发出请求时, 可以通过`dictManager.cancelFetch()`取消当次发起的请求。

::: tip
在`dictManager.fetchDict()`未发出请求时候才可以。
:::

## 演示

### 取消请求

通过调用`dictManager.cancelFetch()`取消。

> 打开浏览器的控制台中的`Network`查看取消请求效果。

<demo vue="./demo-code/cancel-request/demo-01.vue"/>



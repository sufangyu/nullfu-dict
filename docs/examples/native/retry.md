# 失败重试

提供在请求失败是重试机制, 只需要在创建字典管理器时设置`retryCount`, `retryDelay`即可。

- `retryCount`: 重试次数, 默认为`0`
- `retryDelay`: 重试间隔, 默认为`200ms`
- `retryOn`: 是否触发重试的判断回调函数

## 演示

### 重试

下面的代码中, 创建了一个字典管理器, 并且设置`retryCount`为`2`, 在请求失败后会自动重试两次。

> 打开浏览器的控制台中的`Network`查看失败重试请求。

<demo vue="./demo-code/retry/demo-01.vue"/>

### 重试条件

可以设置`retryOn`函数自定义是否要重试, 参数为错误对象, 返回值为`true`表示符合条件，则进行重试。

::: tip
默认只对 HTTP 状态码为5xx、429的错误请求进行重试。
:::

下面例子中, 对 HTTP 状态码是 404 的失败请求也进行重试。

<demo vue="./demo-code/retry/demo-02.vue"/>

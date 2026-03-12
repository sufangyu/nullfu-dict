# 网络请求

关于字典的网络请求, 支持以下配置项:

| 字段                  | 说明                                             | 类型                                                                      | 默认                         |
|-----------------------|--------------------------------------------------|---------------------------------------------------------------------------|------------------------------|
| `url`                 | 接口地址                                         | `string`                                                                  | —                            |
| `method`              | HTTP 请求方法                                    | `get`, `post`                                                             | `'post'`                     |
| `headers`             | 自定义请求头                                     | `Object`                                                                  | —                            |
| `fieldName`           | 提交字典 code 的字段名                           | `string`                                                                  | `'codes'`                    |
| `dictCodeKey`         | 接口返回数据中标识字典 code 的字段名             | `string`                                                                  | `'dictCode'`                 |
| `requestFn`           | 自定义请求函数（可适配 XMLHttpRequest / axios 等） | `(config: RequestConfig) => Promise<TResponse>`                           | 内置 fetch                   |
| `requestInterceptor`  | 请求发送前拦截                                   | `(config: RequestConfig) => RequestConfig \| Promise<RequestConfig>`      | —                            |
| `responseInterceptor` | 响应返回后拦截                                   | `(res: TResponse) => TResponse \| Promise<TResponse>`                     | —                            |
| `isSuccess`           | 判断业务响应是否成功                             | `(res: TResponse) => boolean`                                             | 判断 `res.success` 为`true`  |
| `parseResponseData`   | 从响应中提取“字典列表”                           | `(res: TResponse) => TDict[]`                                             | 返回`res.data`               |
| `parseDict`           | 从字典列表中提取指定 code 的字典数据             | `(dictList: TDict[], code: string, codeKey: string) => TDict \| undefined` | 从`dictList`查找 code 的数据 |



## 演示

### 自定义请求函数

设置请求 `baseURL`、`url`、`method`、`headers`、`fieldName` 等相关配置项。

<demo vue="./demo-code/request/demo-01.vue"/>

### 自定义请求函数

通过`requestFn` 自定义请求函数, 返回一个接口响应的数据对象, 下面例子使用`axios`进行请求函数实现。

<demo vue="./demo-code/request/demo-02.vue"/>

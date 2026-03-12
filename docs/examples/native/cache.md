# 数据缓存

对于字典数据缓存相关有以下配置项:
- cache: 是否启用缓存
- cacheTime: 缓存时间（ms）
- maxCacheSize: 最大缓存条数
- disabledCacheCodes: 禁用缓存的字典编码

缓存数据会采用 LRU 缓存淘汰策略。另外, 可以在调用`fetchDict`时针对单次请求配置不缓存字典数据。


## 演示

### 缓存数据

默认会启用缓存字典数据, 当再次请求已缓存的字典数据时, 会优先从缓存中获取数据直接返回不会再次发起请求。

> 打开浏览器的控制台中的`Network`验证效果。

:::tip
只有在未缓存字典数据时才会发起请求。对于已缓存的字典数据, 在缓存有效期内不会再发起请求。

如果缓存时间未到期, 想通过请求获取最新数据时, 可以在`fetchDict`时配置不使用缓存数据中的数据直接发起请求获取最新的数据。
:::

<demo vue="./demo-code/cache/demo-01.vue"/>


### 禁用缓存

通过设置`caches: false`禁用缓存, 每次请求字典数据会直接发起请求获取数据。

> 打开浏览器的控制台中的`Network`验证效果。

<demo vue="./demo-code/cache/demo-02.vue"/>


### 部分字典不缓存

通过`disabledCacheCodes`设置不缓存的字典数据, 该配置项目中的。

下面示例中, 只设置`disabledCacheCodes: ['DICT_REASON']`, 获取`DICT_REASON`字典数据时每次都会直接发起请求获取数据。

就算`dictManager.fetchDict(['DICT_REASON', 'DICT_OTHER'])`配置有其他的字典编码, 发起的请求也只会查`DICT_REASON`的数据, `DICT_OTHER`直接使用缓存的数据。

> 打开浏览器的控制台中的`Network`验证效果。

<demo vue="./demo-code/cache/demo-03.vue"/>


### 最大缓存条数 & LRU 缓存淘汰策略

通过设置`maxCacheSize`限制缓存的字典数据条数, 当缓存的字典数据条数达到最大值时, 会采用 LRU 缓存淘汰策略, 删除最早不活跃的字典数据。

下面示例中, 设置`maxCacheSize: 4`, 当缓存的字典数据条数达到最大值时, 会删除最早不活跃的字典数据。

根据下面的程序执行, 结合实例中打印输出每一步的结果，可以观察到最大缓存条数和 LRU 缓存淘汰策略。

1. 先塞满 4 个：顺序为 A, B, C, D
2. 再读一次 A（命中缓存）→ A 应移到末尾，顺序变为 B, C, D, A
3. 再请求 E，满容量应淘汰“最久未用”的 B，不是 A

<demo vue="./demo-code/cache/demo-04.vue"/>


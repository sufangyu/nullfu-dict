---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Dict Manager"
  text: "字典管理器"
  tagline: 接口获取字典数据，提供原生核心版本, 以基于核心版本封装的 Vue Hooks API。
  actions:
    - theme: brand
      text: 什么是 DictManager?
      link: /what-is
    - theme: alt
      text: 快速开始
      link: /examples/native/introduce

features:
  - title: 减少请求次数
    details: 在获取字典数据时，会自动将合并窗口期内的多个请求合并为一个请求，减少请求次数。
  - title: 数据缓存
    details: 支持数据缓存，下次请求时，会优先从缓存中获取数据。并且采用 LRU 缓存策略，最近访问/缓存数据会优先读取。
  - title: 自由完整
    details: 支持多个自定义项：请求参数、请求方法、数据处理逻辑等，也支持请求失败重试相关配置。同时, 也提供常用的工具函数, 让对字典数据处理更简单。
---


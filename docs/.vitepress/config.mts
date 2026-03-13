/* eslint-disable check-file/folder-naming-convention */
import type { DefaultTheme } from 'vitepress';
// import vueJsx from '@vitejs/plugin-vue-jsx';
// 参考: https://note.weizwz.com/vitepress/basic/tailwind
import tailwindcss from '@tailwindcss/vite';
import { viteMockServe } from 'vite-plugin-mock';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(vitepressDemoPlugin, {
        stackblitz: {
          show: true,
        },
        codesandbox: {
          show: true,
        },
      });

      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin(),
      tailwindcss(),
      viteMockServe({
        mockPath: '.mock',
      }),
    ],
    ssr: {
      noExternal: [
        'element-plus', // 确保在 SSR 阶段正确处理 Element Plus
      ],
    },
  },

  lang: 'zh-CN',
  title: '字典管理器',
  description: '用于字典数据请求合并、缓存、重试、降级、LRU 管理 的高性能工具，适用于后台配置字典、状态枚举、选项列表等场景',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outlineTitle: '本页导航',
    lastUpdatedText: '上次更新时间',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: [2, 3], // 显示 ## 和 ###
    nav: nav(),

    sidebar: {
      '/api/': { base: '/api/', items: sidebarApi() },
      '/examples/': { base: '/examples/', items: sidebarDemo() },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sufangru/nullfu-dict' },
    ],

    editLink: {
      pattern: 'https://github.com/sufangyu/nullfu-dict/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
  },

});


/**
 * 顶部导航菜单
 * @returns 菜单配置
 */
function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '首页',
      link: '/',
    },
    {
      text: '简介',
      link: '/what-is',
    },
    {
      text: 'API',
      activeMatch: '/api/',
      link: '/api',
      // items: [
      //   {
      //     text: '@nullfux/dict-core',
      //     link: '/api/core',
      //   },
      //   {
      //     text: '@nullfux/dict-vue',
      //     link: '/api/vue',
      //   },
      // ],
    },
    {
      text: '示例',
      activeMatch: '/examples/',
      items: [
        {
          text: '@nullfux/dict-core',
          link: '/examples/native/introduce',
        },
        {
          text: '@nullfux/dict-vue',
          link: '/examples/vue/introduce',
        },
      ],
    },
  ];
}


function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'API & Types',
      // collapsed: false,
      items: [
        { text: '@nullfux/dict-core', link: '/core' },
        { text: '@nullfux/dict-vue', link: '/vue' },
      ],
    },
  ];
}


/**
 * 示例菜单项目
 * @returns 菜单配置
 */
function sidebarDemo(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '@nullfux/dict-core',
      collapsed: false,
      items: [
        { text: '核心库介绍', link: '/native/introduce' },
        { text: '快速开始', link: '/native/getting-started' },
        { text: '基础使用', link: '/native/base' },
        { text: '合并请求', link: '/native/merge-request' },
        { text: '取消请求', link: '/native/cancel-request' },
        { text: '数据缓存', link: '/native/cache' },
        { text: '网络请求', link: '/native/request' },
        { text: '失败重试', link: '/native/retry' },
        { text: '常用方法', link: '/native/methods' },
        { text: '工具函数', link: '/native/utils' },
      ],
    },
    {
      text: '@nullfux/dict-vue',
      collapsed: false,
      items: [
        { text: 'Hooks 介绍', link: '/vue/introduce' },
        { text: '快速开始', link: '/vue/getting-started' },
        { text: '基础使用', link: '/vue/base' },
        { text: '命名空间', link: '/vue/namespace' },
      ],
    },
  ];
}

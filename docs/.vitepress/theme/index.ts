/* eslint-disable check-file/folder-naming-convention */
import type { Theme } from 'vitepress';
import { setupDictPlugin } from '@nullfux/dict-vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import DefaultTheme from 'vitepress/theme';
// https://vitepress.dev/guide/custom-theme
import { h, watchEffect } from 'vue';

import 'virtual:group-icons.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './style.css';
import './tailwind.css';

const zhCnLocale = {
  ...zhCn,
};

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app }) {
    const IS_DEV = (import.meta as any).env?.DEV;

    app.use(ElementPlus, { locale: zhCnLocale, size: 'small' });
    app.use(setupDictPlugin(
      {
        default: { baseURL: 'http://localhost:5173', url: '/api/dict' },
        external: { baseURL: 'http://localhost:5173', url: '/api/external-dict' },
      },
      IS_DEV,
    ));


    app.onUnmount(() => {
      // 监听 VitePress 的主题切换
      watchEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        isDark
          ? document.documentElement.classList.add('element-plus-theme-dark')
          : document.documentElement.classList.remove('element-plus-theme-dark');
      });
    });
  },
} satisfies Theme;

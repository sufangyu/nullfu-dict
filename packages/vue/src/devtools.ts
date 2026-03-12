import type { App } from 'vue';
import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { DictManagerKey } from './symbols';

let devtoolsApi: Parameters<Parameters<typeof setupDevtoolsPlugin>[1]>[0] | null = null;

export function notifyDictDevtoolsUpdate() {
  devtoolsApi?.sendInspectorTree('dict-inspector');
  devtoolsApi?.sendInspectorState('dict-inspector');
}

export function registerDictDevtools(app: App) {
  setupDevtoolsPlugin(
    {
      id: 'nullfu-dict',
      label: 'Dict',
      packageName: 'dict-vue',
      homepage: 'https://github.com/sufangyu/nullfu-dict',
      app,
    },
    (api) => {
      devtoolsApi = api;
      // 1. 添加一个 Inspector 面板
      api.addInspector({
        id: 'dict-inspector',
        label: '字段管理器',
        icon: 'storage',
      });

      function getContext() {
        return app._context.provides[DictManagerKey as any];
      }

      // 2. 构建左侧树（注册的命名空间）
      api.on.getInspectorTree((payload) => {
        if (payload.inspectorId !== 'dict-inspector') {
          return;
        }

        const context = getContext();
        if (!context) {
          payload.rootNodes = [];
          return;
        }

        // 生成 rootNodes
        const nodes = Array.from(context.managerMap.keys()).map(namespace => ({
          id: namespace as string,
          label: namespace as string,
        }));

        payload.rootNodes = nodes;
      });


      // 3. 构建右侧详情（命名空间下的所有字典数据）
      api.on.getInspectorState((payload) => {
        if (payload.inspectorId !== 'dict-inspector') {
          return;
        }

        const context = getContext();
        if (!context) {
          return;
        }


        // namespace 层级
        if (!payload.nodeId.includes(':')) {
          const manager = context.managerMap.get(payload.nodeId);
          if (!manager) {
            return;
          }

          const keys: string[] = manager.getCacheKeys();
          const data: { key: string, value: any }[] = [];
          keys.forEach((key) => {
            const item = manager.getDictCache(key);
            if (!item) {
              return;
            }

            data.push({
              key: `字典数据[${key}]`,
              value: item.data,
            });
          });

          payload.state = {
            namespace: [
              { key: 'size', value: manager.getCacheSize() },
              { key: 'keys', value: manager.getCacheKeys() },
              ...data,
            ],
          };
        }
      });
    },
  );
}

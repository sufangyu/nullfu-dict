import type {
  DictManagerOptions,
  FetchDictOptions,
  RequestConfig,
} from '@nullfu/dict-core';
import {
  createDictManager,
  getDictItems,
  getDictLabel,
  getOptionLabel,
  listToTree,
  transformToOptions,
  treeToArray,
} from '@nullfu/dict-core';

export * from './plugin';
export * from './use-dict';


// 导出核心实现函数、辅助工具函数 ============================================================
export {
  createDictManager,
  getDictItems,
  getDictLabel,
  getOptionLabel,
  listToTree,
  transformToOptions,
  treeToArray,
};


// 导出类型 ---------------------------------------------------------
export type {
  DictManagerOptions,
  FetchDictOptions,
  RequestConfig,
};

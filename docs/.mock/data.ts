/* eslint-disable check-file/folder-naming-convention */
const DICT_FIRST = {
  id: 10001,
  value: 'DICT_FIRST',
  label: '一级分类 A',
  enabled: '1',
  children: [
    {
      id: 10001001,
      value: 'DICT_FIRST-10001',
      label: '一级分类 A-子项 1',
      enabled: '1',
    },
    {
      id: 10001002,
      label: '一级分类 A-子项 2',
      value: 'DICT_FIRST-10001',
      enabled: '0',
    },
    {
      id: 10001003,
      label: '一级分类 A-子项 3',
      value: 'DICT_FIRST-10001',
      enabled: '1',
    },
  ],
};


const DICT_STYLES = {
  id: 20001,
  label: '风格类',
  value: 'DICT_STYLES',
  enabled: '1',
  children: [
    {
      id: 20001001,
      parentId: '',
      label: '现代风',
      value: 'DICT_STYLES-20001',
      enabled: '1',
    },
    {
      id: 20001002,
      parentId: '',
      label: '简约风',
      value: 'DICT_STYLES-20001',
      enabled: '1',
    },
    {
      id: 20001003,
      parentId: 20001001,
      label: '极简现代',
      value: 'DICT_STYLES-20001',
      enabled: '1',
    },
    {
      id: 20001004,
      parentId: 20001001,
      label: '轻奢现代',
      value: 'DICT_STYLES-20001',
      enabled: '1',
    },
    {
      id: 20001005,
      parentId: 20001002,
      label: '北欧简约',
      value: 'DICT_STYLES-20001',
      enabled: '1',
    },
    {
      id: 20001006,
      parentId: 20001002,
      label: '日式简约',
      value: 'DICT_STYLES-20001',
      enabled: '1',
    },
  ],
};


const DICT_REASON = {
  id: 30001,
  label: '用户原因',
  value: 'DICT_REASON',
  enabled: '1',
  children: [
    {
      id: 30001000,
      parentId: '',
      label: '用户原因',
      value: 'DICT_REASON-30001000',
      enabled: '1',
    },
    {
      id: 30002000,
      parentId: '',
      label: '系统原因',
      value: 'DICT_REASON-30002000',
      enabled: '1',
    },
    {
      id: 30001001,
      parentId: 30001000,
      label: '用户主动取消',
      value: 'DICT_REASON-30001001',
      enabled: '1',
    },
    {
      id: 30001002,
      parentId: 30001000,
      label: '信息填写错误',
      value: 'DICT_REASON-30001002',
      enabled: '1',
    },
    {
      id: 30001002001,
      parentId: '30001002',
      label: '信息填写错误-子原因-1',
      value: 'DICT_REASON-30001-30001002001',
      enabled: '1',
    },
    {
      id: 30001002002,
      parentId: '30001002',
      label: '信息填写错误-子原因-2',
      value: 'DICT_REASON-30001-30001002002',
      enabled: '1',
    },
    {
      id: 30002001,
      parentId: 30002000,
      label: '系统异常',
      value: 'DICT_REASON-30002001',
      enabled: '1',
    },
    {
      id: 30003000,
      parentId: '',
      label: '其他原因',
      value: 'DICT_REASON-30003000',
      enabled: '0',
    },
  ],
};


const DICT_SOURCE = {
  id: 70001,
  label: '数据来源',
  value: 'DICT_SOURCE',
  enabled: '1',
  children: [
    {
      id: 70001001,
      label: '用户填写',
      value: 'DICT_SOURCE-70001',
      enabled: '1',
    },
    {
      id: 70001002,
      label: '系统生成',
      value: 'DICT_SOURCE-70001',
      enabled: '1',
    },
  ],
};


const DICT_OTHER = {
  id: 40001,
  label: '用户原因',
  value: 'DICT_OTHER',
  enabled: '1',
  children: [
    {
      id: 40001001,
      label: '其他选项 A',
      value: 'DICT_OTHER-40001001',
      enabled: '1',
    },
    {
      id: 40001002,
      label: '其他选项 B',
      value: 'DICT_OTHER-40001002',
      enabled: '1',
    },
  ],
};


const DICT_ALONE = {
  id: 50001,
  label: '单独字典',
  value: 'DICT_ALONE',
  enabled: '1',
  children: [
    {
      id: 50001001,
      label: '独立项 A',
      value: 'DICT_ALONE-50001001',
      enabled: '1',
    },
    {
      id: 50001002,
      label: '独立项 B',
      value: 'DICT_ALONE-50001002',
      enabled: '1',
    },
  ],
};


export const DICT_DATA = [
  DICT_FIRST,
  DICT_STYLES,
  DICT_REASON,
  DICT_SOURCE,
  DICT_OTHER,
  DICT_ALONE,
];


// 外部系统字典 ======================================================================

const DICT_EXTERNAL = {
  id: 60001,
  label: '外部字典',
  value: 'DICT_EXTERNAL',
  enabled: '1',
  children: [
    {
      id: 60001001,
      label: '外部项 A',
      value: 'DICT_EXTERNAL-60001001',
      enabled: '1',
    },
    {
      id: 60001002,
      label: '外部项 B',
      value: 'DICT_EXTERNAL-60001002',
      enabled: '1',
    },
  ],
};


export const DICT_EXTERNAL_DATA = [
  DICT_EXTERNAL,
];


/* eslint-disable check-file/folder-naming-convention */
import type { MockMethod } from 'vite-plugin-mock';
import { DICT_DATA, DICT_EXTERNAL_DATA } from './data';


export default [
  {
    url: '/api/dict',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [
          { id: 1, name: 'Tom' },
          { id: 2, name: 'Jerry' },
        ],
      };
    },
  },
  {
    url: '/api/dict',
    method: 'post',
    timeout: 1250,
    response: ({ body }) => {
      const result = DICT_DATA.filter(item => body.codes.includes(item.value));
      return getResponseWithBaseData(result);
    },
  },
  // 外部字典
  {
    url: '/api/external-dict',
    method: 'post',
    timeout: 2500,
    response: ({ body }) => {
      const result = [...DICT_DATA, ...DICT_EXTERNAL_DATA].filter(item => body.codes.includes(item.value));
      return getResponseWithBaseData(result);
    },
  },
  // 自定义请求设置
  {
    url: '/api/dict-request-setting',
    method: 'get',
    timeout: 1250,
    response: ({ query }) => {
      const codes: string[] = query.codeList ? query.codeList?.split(',') : [];
      // const result = DICT_DATA.filter(item => codes.includes(item.dictCode));
      const result = {};
      codes.forEach((code) => {
        const curDict = DICT_DATA.find(item => item.value === code);
        result[code] = {
          ...curDict,
        };
      });

      return {
        code: '200',
        successful: true,
        data: result,
      };
    },
  },
] as MockMethod[];


/**
 * 获取响应数据
 * @param data 数据
 * @returns 响应数据
 */
function getResponseWithBaseData(data: any) {
  return {
    code: 200,
    success: true,
    data,
  };
}

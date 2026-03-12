<script lang="ts" setup>
import type { DictItemDefault } from '@nullfu/dict-core';
import { createDictManager, getDictItems } from '@nullfu/dict-core';
import { onMounted, ref } from 'vue';

// 响应数据类型
interface ResponseData {
  code: string;
  successful: boolean;
  data: Record<string, DictItemDefault>;
}

const stylesDictList = ref<DictItemDefault[]>([]);
const reasonDictList = ref<DictItemDefault[]>([]);

const dictManager = createDictManager<DictItemDefault, ResponseData>({
  baseURL: 'http://localhost:5173',
  url: '/api/dict-request-setting',
  method: 'get',
  headers: {
    'X-Custom': 'custom-headers',
  },
  fieldName: 'codeList',
  requestInterceptor: (config) => {
    config.headers = {
      ...config.headers,
      'X-Custom-Interceptor': 'custom-interceptor',
    };

    return config;
  },
  responseInterceptor: (res) => {
    console.log('响应拦截器', res);
    return res;
  },
  isSuccess: (res) => {
    return res.successful || res.code === '200';
  },
  parseResponseData: (res) => {
    const list: DictItemDefault[] = [];
    Object.entries(res.data).forEach(([_key, value]) => {
      list.push(value);
    });
    return list;
  },
  parseDict(dictList, code, codeKey) {
    // console.log('解析字典数据', dictList, code, codeKey);
    return dictList.find(it => it[codeKey] === code);
  },
});

onMounted(async () => {
  const res = await dictManager.fetchDict(['DICT_STYLES', 'DICT_REASON']);
  stylesDictList.value = getDictItems(res.DICT_STYLES);
  reasonDictList.value = getDictItems(res.DICT_REASON);
});
</script>


<template>
  <div>
    <p class="my-1!">
      DICT_STYLES: {{ stylesDictList.length }}
    </p>
    <p class="my-1!">
      DICT_REASON: {{ reasonDictList.length }}
    </p>
  </div>
</template>

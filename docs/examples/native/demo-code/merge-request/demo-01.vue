<script lang="ts" setup>
import type { DictItemDefault } from '@nullfux/dict-core';
import { createDictManager, getDictItems } from '@nullfux/dict-core';
import { onMounted, ref } from 'vue';


const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});


const firstDictList = ref<DictItemDefault[]>([]);
async function getDictFirst() {
  const res = await dictManager.fetchDict('DICT_FIRST');
  console.log('DICT_FIRST', res);
  firstDictList.value = getDictItems(res.DICT_FIRST);
}

const styleDictList = ref<DictItemDefault[]>([]);
async function getDictStyles() {
  const res = await dictManager.fetchDict('DICT_STYLES');
  console.log('DICT_STYLES', res);
  styleDictList.value = getDictItems(res.DICT_STYLES);
}

const reasonDictList = ref<DictItemDefault[]>([]);
async function getDictReason() {
  const res = await dictManager.fetchDict('DICT_REASON');
  console.log('DICT_REASON', res);
  reasonDictList.value = getDictItems(res.DICT_REASON);
}

const sourceDictList = ref<DictItemDefault[]>([]);
const ohterDictList = ref<DictItemDefault[]>([]);
async function getDictMulti() {
  const res = await dictManager.fetchDict(['DICT_SOURCE', 'DICT_OTHER']);
  console.log('DICT_SOURCE & DICT_OTHER', res);
  sourceDictList.value = getDictItems(res.DICT_SOURCE);
  ohterDictList.value = getDictItems(res.DICT_OTHER);
}

const aloneDictList = ref<DictItemDefault[]>([]);
async function getDictAlone() {
  const res = await dictManager.fetchDict(['DICT_ALONE']);
  console.log('DICT_ALONE', res);
  aloneDictList.value = getDictItems(res.DICT_ALONE);
}

onMounted(async () => {
  // 1. 等待完成才会请求后续
  await getDictFirst();

  // 2. 异步请求 & 在合并请求窗口内的延迟请求, 会被合并
  getDictStyles();
  getDictReason();
  setTimeout(() => getDictMulti(), 10);

  // 3. 在合并请求窗口外的延迟请求, 会单独一个请求
  setTimeout(() => getDictAlone(), 1250);
});
</script>


<template>
  <div>
    <div>
      <h1 class="text-lg! my-1!">
        同步优先请求:
      </h1>
      <p class="my-1!">
        DICT_FIRST: {{ firstDictList.length }}
      </p>
    </div>

    <div class="border-t border-gray-500 my-6" />

    <div>
      <h1 class="text-lg! my-1!">
        异步请求 & 合并请求窗口内延迟请求:
      </h1>
      <p class="my-1!">
        DICT_STYLES: {{ styleDictList.length }}
      </p>
      <p class="my-1!">
        DICT_REASON: {{ reasonDictList.length }}
      </p>
      <p class="my-1!">
        DICT_SOURCE: {{ sourceDictList.length }}
      </p>
      <p class="my-1!">
        DICT_OTHER: {{ ohterDictList.length }}
      </p>
    </div>

    <div class="border-t border-gray-500 my-6" />

    <div>
      <h1 class="text-lg! my-1!">
        合并请求窗口外的延迟请求:
      </h1>
      <p class="my-1!">
        DICT_ALONE: {{ aloneDictList.length }}
      </p>
    </div>
  </div>
</template>

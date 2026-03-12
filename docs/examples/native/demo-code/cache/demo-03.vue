<script lang="ts" setup>
import type { DictItemDefault } from '@nullfu/dict-core';
import { createDictManager, getDictItems } from '@nullfu/dict-core';
import { onMounted, ref } from 'vue';


const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
  disableCacheCodes: ['DICT_REASON'],
});

const stylesDictList = ref<DictItemDefault[]>([]);
async function getDictStyles() {
  const res = await dictManager.fetchDict('DICT_STYLES');
  console.log('DICT_STYLES', res);
  stylesDictList.value = getDictItems(res.DICT_STYLES);
}

const reasonsDictList = ref<DictItemDefault[]>([]);
const otherDictList = ref<DictItemDefault[]>([]);
async function getDictReason() {
  const res = await dictManager.fetchDict(['DICT_REASON', 'DICT_OTHER']);
  console.log('DICT_REASON', res);
  reasonsDictList.value = getDictItems(res.DICT_REASON);

  if (res.DICT_OTHER) {
    otherDictList.value = getDictItems(res.DICT_OTHER);
  }
}

onMounted(async () => {
  getDictStyles();
  getDictReason();
});
</script>


<template>
  <div>
    <p class="my-1!">
      DICT_STYLES: {{ stylesDictList.length }}
    </p>
    <p class="my-1!">
      DICT_REASON: {{ reasonsDictList.length }}
    </p>
    <p class="my-1!">
      DICT_OTHER: {{ otherDictList.length }}
    </p>
    <ElButton type="primary" @click="getDictStyles">
      再次获取字典-已缓存
    </ElButton>
    <ElButton type="danger" @click="getDictReason">
      再次获取字典-过滤缓存
    </ElButton>
  </div>
</template>

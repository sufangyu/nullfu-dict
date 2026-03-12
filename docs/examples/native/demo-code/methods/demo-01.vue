<script lang="ts" setup>
import type { CacheItem, DictItemDefault } from '@nullfu/dict-core';
import { createDictManager } from '@nullfu/dict-core';
import { onMounted, ref } from 'vue';

const cacheDict = ref<CacheItem<DictItemDefault>>();

const code = 'DICT_FIRST';
const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});

onMounted(async () => {
  await dictManager.fetchDict(code);
  cacheDict.value = dictManager.getDictCache(code);
  console.log('字典缓存信息::', cacheDict.value);
});
</script>


<template>
  <div>
    <p>字典缓存信息: {{ cacheDict }}</p>
  </div>
</template>

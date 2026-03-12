<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { createDictManager, type DictItemDefault, getDictItems } from '@nullfu/dict-core';

const dictData = ref<Record<string, DictItemDefault>>({});

const code = 'DICT_FIRST';
const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});

onMounted(async() => {
  const res = await dictManager.fetchDict(code);
  dictData.value = res;
  console.log('字典查询结果::', res, getDictItems(res[code]));
});
</script>


<template>
<div>
  <p>字典数据: {{ dictData }}</p>
</div>
</template>

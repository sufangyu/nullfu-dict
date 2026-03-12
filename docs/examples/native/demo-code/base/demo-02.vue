<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { createDictManager, type DictItemDefault, getDictItems } from '@nullfu/dict-core';

const dictData = ref<Record<string, DictItemDefault>>({});

const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});

onMounted(async() => {
  const res = await dictManager.fetchDict(['DICT_STYLES', 'DICT_REASON']);
  dictData.value = res;
  console.log('字典查询结果::', res);
});
</script>


<template>
  <div>
    <div>
      <h1 class="text-lg! my-1!">字典数据-DICT_STYLES:</h1>
      <p class="my-1!">{{ dictData.DICT_STYLES }}</p>
    </div>

    <div class="border-t border-gray-500 my-6"></div>

    <div>
      <h1 class="text-lg! my-1!">字典数据-DICT_REASON:</h1>
      <p class="my-1!">{{ dictData.DICT_REASON }}</p>
    </div>
  </div>
</template>

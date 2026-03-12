<script lang="ts" setup>
import { createDictManager } from '@nullfu/dict-core';


const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
  mergeDelay: 125,
});

const cancelRequest = async() => {
  const p = dictManager.fetchDict(['DICT_CANCEL_REQUESR']);
  // 在合并请求窗口期内取消（请求发出前）
  setTimeout(() => dictManager.cancelFetch(), 50);

  try {
    await p;
  } catch (err) {
    console.log('已取消（请求未发出）', err.message);
    alert(err.message);
  }
}
</script>


<template>
  <div>
    <ElButton type="primary" @click="cancelRequest">获取字典</ElButton>
  </div>
</template>

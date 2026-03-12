<script lang="ts" setup>
import { createDictManager } from '@nullfux/dict-core';
import { ref } from 'vue';


const retryConfig = ref({
  retry: 2,
  retryDelay: 200,
});

async function handleGetDictRetry() {
  console.log('当前重试配置::', retryConfig.value);
  const retryDictManager = createDictManager({
    baseURL: 'http://localhost:5173',
    url: '/api/dict-retry',
    retry: 2,
    retryOn: (err) => {
      const status = err?.status;
      return status >= 500 || status === 404;
    },
  });

  await retryDictManager.fetchDict('DICT_RETRY');
}
</script>


<template>
  <div>
    <el-button type="primary" @click="handleGetDictRetry">
      获取字典
    </el-button>
  </div>
</template>

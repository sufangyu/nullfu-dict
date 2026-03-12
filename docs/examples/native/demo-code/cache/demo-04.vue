<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { createDictManager } from '@nullfu/dict-core';


const maxCacheSizeManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
  maxCacheSize: 4,
});

const logResult = ref<string[]>([]);
const pinrtLog = (msg: string) => {
  logResult.value.push(msg);
  console.log(msg);
};

const handleValidateMaxCacheSize = async() => {
  // 先塞满 4 个：顺序为 A, B, C, D
  await maxCacheSizeManager.fetchDict('A');
  await maxCacheSizeManager.fetchDict('B');
  await maxCacheSizeManager.fetchDict('C');
  await maxCacheSizeManager.fetchDict('D');
  pinrtLog(`1.当前缓存的keys:: ${maxCacheSizeManager.getCacheKeys()}`);

  // 再读一次 A（命中缓存）→ A 应移到末尾，顺序变为 B, C, D, A
  await maxCacheSizeManager.fetchDict('A');
  pinrtLog(`2.当前缓存的keys:: ${maxCacheSizeManager.getCacheKeys()}`);

  // 再请求 E，满容量应淘汰“最久未用”的 B，不是 A
  await maxCacheSizeManager.fetchDict('E');
  pinrtLog(`3.当前缓存的keys:: ${maxCacheSizeManager.getCacheKeys()}`);
};


onMounted(async() => {
  handleValidateMaxCacheSize();
});
</script>


<template>
  <div>
    <h1 class="text-lg! my-1!">结果输入打印:</h1>
    <p class="my-1!" v-if="logResult.length === 0">...</p>
    <template v-else>
      <p
        class="my-1!"
        v-for="(log, idx) in logResult"
        :key="idx"
      >
        {{ log }}
      </p>
    </template>

  </div>
</template>

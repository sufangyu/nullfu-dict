<script lang="tsx" setup>
import { useDict } from '@nullfux/dict-vue';
import { ElMessage } from 'element-plus';


const { loading, data, dictMap } = useDict('DICT_REASON', {
  namespace: 'external',
  dictManagerOptions: {
    url: '/api/external-dict-overwrite',
  },
  onFetchDictError: (status, message, _error) => ElMessage.error({ message: `[${status}] ${message}`, grouping: true }),
});
</script>


<template>
  <div class="text-sm">
    <h1 class="text-lg!">
      命名空间: external
    </h1>
    <div class="py-2">
      加载状态: {{ loading }}
    </div>
    <div class="py-2">
      接口数据: {{ data }}
    </div>
    <div class="py-2">
      字典(DICT_REASON)数据个数: {{ dictMap.DICT_REASON?.length }}
    </div>
  </div>
</template>


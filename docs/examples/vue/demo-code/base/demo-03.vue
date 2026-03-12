<script lang="tsx" setup>
import { useDict } from '@nullfu/dict-vue';

// 使用 as const 才会把数组当作 只读元组（readonly tuple）
const codes = ['DICT_STYLES', 'DICT_REASON'] as const;

const { loading, data, dictMap } = useDict(codes);
</script>

<template>
  <div class="text-sm">
    <div class="py-2">
      加载状态: {{ loading }}
    </div>
    <div class="py-2">
      接口数据: {{ data }}
    </div>
    <div class="py-2">
      <p>字典(DICT_STYLES)数据个数: {{ dictMap.DICT_STYLES?.length }}</p>
      <p>字典(DICT_REASON)数据个数: {{ dictMap.DICT_REASON?.length }}</p>
    </div>
  </div>
</template>


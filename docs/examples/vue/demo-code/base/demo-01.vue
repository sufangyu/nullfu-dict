<script lang="tsx" setup>
import { useDict } from '@nullfu/dict-vue';

const code = 'DICT_STYLES';

const { loading, data, dictMap } = useDict(code);
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
      字典({{code}})数据个数: {{ dictMap[code]?.length }}
    </div>
  </div>
</template>


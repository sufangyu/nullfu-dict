<script lang="tsx" setup>
import { useDict } from '@nullfu/dict-vue';

const code = 'DICT_FIRST';
const { loading, data, dictMap, load } = useDict(code, {
  immediate: false,
});
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
      字典({{ code }})个数: {{ dictMap[code]?.length }}
    </div>

    <div class="py-2">
      <ElButton type="primary" @click="load">
        获取字典
      </ElButton>
    </div>
  </div>
</template>


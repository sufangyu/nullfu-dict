<script lang="tsx" setup>
import { useDict } from '@nullfu/dict-vue';

const code = 'DICT_OTHER';
const codes = ['DICT_STYLES', 'DICT_REASON'] as const;
const { loading, data, dictMap } = useDict(codes);
const {
  loading: loadingForOther,
  data: dataForOther,
  dictMap: dictMapForOther,
} = useDict(code);

// 外部字典
const codeExternal = 'DICT_EXTERNAL';
const {
  loading: loadingForExternal,
  data: dataForExternal,
  dictMap: dictMapForExternal,
} = useDict(codeExternal, {
  namespace: 'external',
});
</script>

<template>
  <div class="text-sm">
    <div class="py-2">
      <p>字典(DICT_STYLES)数据个数: {{ dictMap.DICT_STYLES?.length }}</p>
      <p>字典(DICT_REASON)数据个数: {{ dictMap.DICT_REASON?.length }}</p>
      <p>字典(DICT_OTHER)数据个数: {{ dictMapForOther.DICT_OTHER?.length }}</p>
      <p>外部字典(DICT_EXTERNAL)数据个数: {{ dictMapForExternal.DICT_EXTERNAL?.length }}</p>
    </div>
  </div>
</template>


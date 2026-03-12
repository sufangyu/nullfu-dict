<script lang="ts" setup>
import { computed } from 'vue';
import { DictItemDefault, getDictLabel } from '@nullfu/dict-core';

// 自定义的数据类型
interface DictItem  {
  id: string;
  dictName: string;
  dictCode: string;
}


// 默认数据类型
const dictListDefault: DictItemDefault[] = [
  { id: '101', label: '字典名称1', value: '101' },
  { id: '102', label: '字典名称2', value: '102' },
  { id: '103', label: '字典名称3', value: '103' },
];
const dictNameDefault = computed(() => {
  return getDictLabel('102', dictListDefault);
});
const dictNameDefaultUnfinde = computed(() => {
  return getDictLabel('104', dictListDefault);
});
const dictNameDefaultEmpty = computed(() => {
  return getDictLabel('', dictListDefault, {
    placeholder: '--',
  });
});


// 自定义数据类型
const dictListCustom: DictItem[] = [
  { id: '101', dictName: '字典名称1', dictCode: '101' },
  { id: '102', dictName: '字典名称2', dictCode: '102' },
  { id: '103', dictName: '字典名称3', dictCode: '103' },
];
const dictNameCustom = computed(() => {
  return getDictLabel<DictItem>('102', dictListCustom, {
    labelKey: 'dictName',
    valueKey: 'dictCode',
  });
});
const dictNameCustomUnfinde = computed(() => {
  return getDictLabel<DictItem>('104', dictListCustom, {
    labelKey: 'dictName',
    valueKey: 'dictCode',
  });
});



</script>


<template>
<div>
  <p class="my-1!">默认数据类型: {{ dictNameDefault }}</p>
  <p class="my-1!">匹配不上数据: {{ dictNameDefaultUnfinde }}</p>
  <p class="my-1!">空数据占位符: {{ dictNameDefaultEmpty }}</p>
  <ElDivider />
  <p class="my-1!">自定义数据类型: {{ dictNameCustom }}</p>
</div>
</template>

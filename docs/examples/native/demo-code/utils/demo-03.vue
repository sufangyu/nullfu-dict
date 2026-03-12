<script lang="ts" setup>
import { ref } from 'vue';
import { createDictManager, DictItemDefault, getDictItems, listToTree } from '@nullfu/dict-core';

interface DictItem {
  id: string | number;
  dictName: string;
  dictCode: string;
  children?: DictItem[];
}

// 配置项
const from = ref({
  maxLevel: 0,
  cleanSource: true,
});

const dictItem = ref<DictItemDefault | null>(null);
const dictTree = ref<DictItem[]>([]);

const code = 'DICT_REASON';
const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});

const handleGetDictData = async () => {
  dictTree.value = [];
  dictItem.value = null;

  const res = await dictManager.fetchDict(code);

  const curDictList = getDictItems(res[code]);
  const curDictTree = listToTree<DictItemDefault, DictItem>(curDictList, {
    labelKey: 'dictName',
    valueKey: 'dictCode',
    cleanSource: from.value.cleanSource,
    maxLevel: from.value.maxLevel,
  });

  dictTree.value = curDictTree;
  console.log('[工具函数] listToTree::', dictTree.value);
}
</script>


<template>
<div>
  <p class="my-1!">字典数据: {{ dictTree.length }}</p>
  <p class="my-1!">选择字典: {{ dictItem }}</p>
  <ElCascader
    v-model="dictItem"
    :options="dictTree"
    :props="{
      label: 'dictName',
      value: 'dictCode',
    }"
  />

  <ElDivider />

  <div>
    <ElForm :model="from">
      <ElFormItem label="最大层级">
        <ElSlider v-model="from.maxLevel" :min="0" :max="9" show-stops />
      </ElFormItem>
      <ElFormItem label="删除源字段">
        <ElSwitch v-model="from.cleanSource" />
      </ElFormItem>
      <ElFormItem label="">
        <ElButton type="primary" @click="handleGetDictData">
          获取数据-树形
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</div>
</template>

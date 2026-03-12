<script lang="ts" setup>
import { ref } from 'vue';
import { createDictManager, DictItemDefault, getDictItems } from '@nullfu/dict-core';


// 配置项
const from = ref({
  isEnable: false,
});

const dictItem = ref<DictItemDefault | null>(null);
const dictList = ref<DictItemDefault[]>([]);

const code = 'DICT_REASON';
const dictManager = createDictManager({
  baseURL: 'http://localhost:5173',
  url: '/api/dict',
});

const handleGetDictData = async () => {
  dictList.value = [];
  dictItem.value = null;

  const res = await dictManager.fetchDict(code);

  const curDictList = getDictItems(res[code], {
    childrenKey: 'children',
    enabledOnly: from.value.isEnable,
    enabledOn: (item) => {
      console.log('自定义可用项条件::', item);
      return item.enabled === '1';
    },
  });

  dictList.value = curDictList;
  console.log('[工具函数] getDictItems::', dictList.value);
}
</script>


<template>
<div>
  <p class="my-1!">字典数据: {{ dictList.length }}</p>
  <p class="my-1!">选择字典: {{ dictItem }}</p>
  <ElSelect v-model="dictItem" placeholder="请选择字典">
    <ElOption
      v-for="item in dictList"
      :key="item.id"
      :label="item.label"
      :value="item.value"
      :disabled="item.enabled === '0'"
    >
      {{ item.label }}
      （{{ item.value }} / {{ item.enabled }}）
    </ElOption>
  </ElSelect>
  <ElDivider />
  <div>
    <ElForm :model="from">
      <ElFormItem label="过滤禁用项">
        <ElSwitch v-model="from.isEnable" />
      </ElFormItem>
      <ElFormItem label="">
        <ElButton type="primary" @click="handleGetDictData">
          获取字典数据
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</div>
</template>

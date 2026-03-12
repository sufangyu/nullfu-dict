<script lang="ts" setup>
import type { DictItemDefault } from '@nullfux/dict-core';
import { treeToArray } from '@nullfux/dict-core';
import { ref } from 'vue';

interface DictItem {
  id: string | number;
  dictName: string;
  dictCode: string;
  level: number;
  isEnabled: string;
  children?: DictItem[];
}

const TREE_DATA = [
  {
    id: 30001000,
    parentId: '',
    label: '用户原因',
    value: 'DICT_REASON-30001000',
    disabled: false,
    children: [
      {
        id: 30001001,
        parentId: 30001000,
        label: '用户主动取消',
        value: 'DICT_REASON-30001001',
        disabled: false,
        children: [],
      },
      {
        id: 30001002,
        parentId: 30001000,
        label: '信息填写错误',
        value: 'DICT_REASON-30001002',
        disabled: false,
        children: [
          {
            id: 30001002001,
            parentId: '30001002',
            label: '信息填写错误-1',
            value: 'DICT_REASON-30001-30001002001',
            disabled: false,
            children: [],
          },
          {
            id: 30001002002,
            parentId: '30001002',
            label: '信息填写错误-2',
            value: 'DICT_REASON-30001-30001002002',
            disabled: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 30002000,
    parentId: '',
    label: '系统原因',
    value: 'DICT_REASON-30002000',
    disabled: false,
    children: [
      { id: 30002001, parentId: 30002000, label: '系统异常', value: 'DICT_REASON-30002001', children: [], disabled: false },
    ],
  },
  {
    id: 30003000,
    parentId: '',
    label: '其他原因',
    value: 'DICT_REASON-30003000',
    disabled: true,
    children: [],
  },
];

// 配置项
const from = ref({
  maxLevel: 0,
  cleanSource: true,
});

const dictList = ref<DictItem[]>([]);

async function handleGetDictData() {
  const curDictList = treeToArray<DictItemDefault, DictItem>(TREE_DATA, {
    labelKey: 'dictName',
    valueKey: 'dictCode',
    transformer: (node, dictItem, cleanSource) => {
      dictItem.isEnabled = node.disabled ? '0' : '1';
      if (cleanSource) {
        delete (dictItem as typeof node).disabled;
      }
    },
    cleanSource: from.value.cleanSource,
    maxLevel: from.value.maxLevel,
  });

  dictList.value = curDictList;
  console.log('[工具函数] treeToArray::', dictList.value);
}
</script>


<template>
  <div>
    <ElRow :gutter="32">
      <ElCol :span="12">
        <h1 class="text-base! my-1!">
          数据源-{{ TREE_DATA.length }}
        </h1>
        <ElCascader
          :options="TREE_DATA"
          style="width: 100%"
        />
      </ElCol>
      <ElCol :span="12">
        <h1 class="text-base! my-1!">
          转换结果-{{ dictList.length }}
        </h1>
        <ElSelect :options="dictList">
          <ElOption
            v-for="dictItem in dictList"
            :key="dictItem.id"
            :value="dictItem.dictCode"
            :disabled="dictItem.isEnabled === '0'"
          >
            {{ dictItem.dictName }} / {{ dictItem.dictCode }} / {{ dictItem.level }} / {{ dictItem.isEnabled }}
          </ElOption>
        </ElSelect>
      </ElCol>
    </ElRow>


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
            获取数据-偏平数组
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

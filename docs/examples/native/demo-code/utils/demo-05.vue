<script lang="ts" setup>
import { getOptionLabel, transformToOptions } from '@nullfu/dict-core';
import { computed, ref } from 'vue';

const STATUS_OBJ = {
  启用: '1',
  禁用: '0',
};

enum STATUS_ENUM {
  启用 = '1',
  禁用 = '0',
};

const valueObj = ref(STATUS_OBJ.启用);
const listObj = computed(() => {
  return transformToOptions<
    typeof STATUS_OBJ,
    'label',
    'value',
    {
      disabled: boolean,
    }
  >(STATUS_OBJ, {
    // transformLabel: (key, value) => {
    //   if (key === '禁用') {
    //     return '停用';
    //   }
    //   return key;
    // },
    // transformValue: (value, key) => {
    //   return Number(value);
    // },
    extra: (key, value) => {
      return {
        disabled: value === '0',
      };
    },
  });
});

const valueEnum = ref(STATUS_ENUM.启用);
const listEnum = computed(() => {
  return transformToOptions(STATUS_ENUM);
});
</script>


<template>
  <div>
    <ElRow :gutter="32">
      <ElCol :span="12">
        <h1 class="text-base! my-1!">
          普通对象转换 - {{ getOptionLabel(valueObj, listObj) }} / {{ valueObj }}
        </h1>
        <ElSelect v-model="valueObj">
          <ElOption
            v-for="item in listObj"
            :key="item.label"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </ElOption>
        </ElSelect>
      </ElCol>
      <ElCol :span="12">
        <h1 class="text-base! my-1!">
          枚举转换 - {{ getOptionLabel(valueEnum, listEnum) }} / {{ valueEnum }}
        </h1>
        <ElSelect v-model="valueEnum">
          <ElOption
            v-for="item in listEnum"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </ElOption>
        </ElSelect>
      </ElCol>
    </ElRow>
  </div>
</template>

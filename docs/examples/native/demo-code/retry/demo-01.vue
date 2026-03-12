<script lang="ts" setup>
import { ref } from 'vue';
import { createDictManager } from '@nullfu/dict-core';


const retryConfig = ref({
  retry: 2,
  retryDelay: 200,
});

const handleGetDictRetry = async() => {
  console.log('当前重试配置::', retryConfig.value);
  const retryDictManager = createDictManager({
    url: 'https://api.demo.com/api/dict',
    ...retryConfig.value,
  });

  await retryDictManager.fetchDict('DICT_RETRY');
}


</script>


<template>
  <div>
    <ElForm :model="retryConfig">
      <ElFormItem label="重试次数">
        <ElInput-number v-model="retryConfig.retry" :precision="0" :min="0" :max="5" />
      </ElFormItem>
      <ElFormItem label="重试间隔时间">
        <div class="w-96">
          <ElSlider
            v-model="retryConfig.retryDelay"
            :min="100"
            :max="1000"
            :step="50"
            show-stops
          />
        </div>
      </ElFormItem>
      <ElFormItemm>
        <ElButton type="primary" @click="handleGetDictRetry">获取字典</ElButton>
      </ElFormItemm>
    </ElForm>
  </div>
</template>

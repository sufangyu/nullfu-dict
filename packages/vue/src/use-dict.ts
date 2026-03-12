import type { DictItemDefault, DictManagerOptions, FetchDictOptions, HTTPError } from '@nullfux/dict-core';
import type { ComputedRef, MaybeRef } from 'vue';
import type { DictCodes } from './types';
import { getDictItems, getDictLabel } from '@nullfux/dict-core';
import { computed, isRef, ref, shallowRef, unref, watch } from 'vue';
import { useDictManager } from './use-dict-manager';


/**
 * 字典 hooks
 * @type T 字典数据类型
 * @type C 字典 code 类型
 * @param code 字典 code, 支持字符串, 数组
 * @param options 配置项
 * @param options.namespace 命名空间
 * @param options.immediate 是否立即执行请求, 设置为`false`时需要手动调用`load`方法获取数据
 * @param options.fetchDictOptions 字典请求配置项
 * @param options.dictManagerOptions 字典配置项
 * @param options.onFetchDictError 字典请求错误回调
 */
export function useDict<
  T extends Record<string, any> = DictItemDefault,
  C extends string | readonly string[] = string,
>(
  code: MaybeRef<C>,
  options?: {
    /** 命名空间 */
    namespace?: string,
    /** 是否立即执行, 默认`true` */
    immediate?: boolean,
    /** 字典请求配置 */
    fetchDictOptions?: FetchDictOptions,
    /** 字典管理配置, 会覆盖注册时的配置 */
    dictManagerOptions?: Partial<DictManagerOptions<T>>,
    /**
     * 字典请求错误回调
     * @param status 状态码
     * @param message 错误信息
     * @param error 错误对象
     */
    onFetchDictError?: (status: number, message: string, error: HTTPError) => void,
  },
) {
  const { namespace = 'default', immediate = true } = options ?? {};
  const manager = useDictManager(namespace, options?.dictManagerOptions);

  // 请求字典数据
  const data = shallowRef<Record<string, T>>({});
  const loading = ref(false);
  const error = ref<unknown>(null);

  const load = async () => {
    const currentCode = unref(code) as string | string[];
    if (!currentCode)
      return;

    loading.value = true;
    error.value = null;

    try {
      const result = await manager.fetchDict(currentCode, options?.fetchDictOptions);
      data.value = result;
    } catch (err) {
      const fetchError = err as HTTPError;
      error.value = fetchError.message;

      options?.onFetchDictError?.(fetchError.status, fetchError.message, fetchError);
    } finally {
      loading.value = false;
    }
  };

  if (isRef(code)) {
    watch(code, () => load(), { immediate });
  } else if (immediate) {
    load();
  }

  const codes = computed(() => {
    const c = unref(code);
    return Array.isArray(c) ? c : c ? [c] : [];
  });

  /**
   * 字典数据 Map
   * @description 可根据指定字典编码获取其对应字典数据
   */
  const dictMap: ComputedRef<Record<DictCodes<C>, T[]>> = computed(() => {
    const map = {} as Record<DictCodes<C>, T[]>;
    codes.value.forEach((c) => {
      const dict = data.value[c];
      map[c as DictCodes<C>] = dict ? (getDictItems<T>(dict) as T[]) : [];
    });
    return map;
  });


  /**
   * 获取字典标签
   * @param dictCode 字典编码
   * @param value 字典值
   */
  const getLabel = (dictCode: DictCodes<C>, value: string | number | undefined | null) => {
    const list = dictMap.value[dictCode] || [];
    return getDictLabel(value, list);
  };


  return {
    data,
    loading,
    error,
    load,
    reload: load,
    dictMap,
    getLabel,
  };
}

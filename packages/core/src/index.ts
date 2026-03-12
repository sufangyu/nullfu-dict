import type { CacheItem, DictItemDefault, DictManagerOptions, FetchDictOptions, RecordBase, RequestConfig } from './types';
import {
  defaultFetchRequest,
  defaultIsSuccess,
  defaultParseDict,
  defaultParseResponseData,
  defaultRetryOn,
} from './defaults';
import { buildFullPath, withRetry } from './helper';
import {
  getDictItems,
  getDictLabel,
  getOptionLabel,
  listToTree,
  transformToOptions,
  treeToArray,
} from './utils';


/**
 * 创建字典管理器
 * @param options 配置项
 * @type TDict 字典数据类型
 * @type TResponse 接口返回的数据类型
 */
export function createDictManager<
  TDict extends RecordBase = DictItemDefault,
  TResponse = any,
>(options: DictManagerOptions<TDict, TResponse>) {
  const {
    baseURL = '',
    url,
    method = 'post',
    headers,
    fieldName = 'codes',
    dictCodeKey = 'value',
    cache = true,
    cacheTime = 1000 * 60 * 60,
    maxCacheSize = 100,
    disabledCacheCodes = [],
    mergeDelay = 25,
    retry = 0,
    retryDelay = 200,
    fallbackOnError = true,

    requestFn = defaultFetchRequest,
    requestInterceptor,
    responseInterceptor,
    isSuccess = defaultIsSuccess,
    parseResponseData = defaultParseResponseData,
    parseDict = defaultParseDict,
    retryOn = defaultRetryOn,
    onCacheChange,
  } = options;


  /** 缓存已请求成功的字典（code -> CacheItem） */
  const cacheMap = new Map<string, CacheItem<TDict>>();

  /**
   * code -> resolver[]
   * 同一 code 在合并窗口内可能被多次请求，多个 resolver 共享一次网络请求
   */
  const resolverMap = new Map<
    string,
    { resolve: (v: any) => void, reject: (e: any) => void }[]
  >();

  /** 正在请求的字典 codes 集合 */
  const pendingCodes = new Set<string>();


  /** 合并窗口 */
  let mergeTimer: ReturnType<typeof setTimeout> | null = null;

  /** 当前批次请求的取消控制器 */
  let controller: AbortController | null = null;


  /* ==================================================== 工具函数 ==================================================== */

  /**
   * 是否可以缓存
   * @param code 字段编码
   * @param disabled 是否禁用
   */
  function _shouldCache(code: string, disabled?: boolean) {
    return cache && !disabled && !disabledCacheCodes.includes(code);
  };

  /**
   * 是否已过期
   * @param item 字典缓存数据
   */
  function _isExpired(item: CacheItem) {
    return item.expireAt !== undefined && Date.now() > item.expireAt;
  };


  /**
   * 设置缓存
   * @description 超出 maxCacheSize 时删除最久未用（Map 第一个 key）；写入时已存在的 key 会先删后插，移到“最新”位置
   * @param code 字典编码
   * @param item 缓存字典数据
   */
  function _setCache(code: string, item: CacheItem<TDict>) {
    if (cacheMap.has(code)) {
      cacheMap.delete(code);
    }
    cacheMap.set(code, item);

    if (maxCacheSize && cacheMap.size > maxCacheSize) {
      const oldestKey = cacheMap.keys().next().value;
      cacheMap.delete(oldestKey!);
    }

    onCacheChange?.({ type: 'set', code, codes: [code] });
  }


  /**
   * 读命中时刷新 LRU 顺序
   * @description 把该 code 移到“最近使用”（Map 末尾），避免先被淘汰
   * @param code 字典编码
   */
  function _touchCache(code: string) {
    const item = cacheMap.get(code);
    if (!item) {
      return;
    }
    cacheMap.delete(code);
    cacheMap.set(code, item);
  }


  /* ==================================================== 核心：批量请求 ==================================================== */

  /**
   * 发起合并的请求
   */
  async function _mergeRequest() {
    const codes = Array.from(pendingCodes);
    pendingCodes.clear();
    mergeTimer = null;

    // 为当前批次创建新的控制器
    controller = new AbortController();
    const currentController = controller;

    // 获取最终请求路径
    const finalURL = buildFullPath(baseURL, url);

    let config: RequestConfig = {
      url: finalURL,
      method,
      headers,
      signal: currentController.signal,
      ...(
        method === 'get'
          ? { params: { [fieldName]: codes } }
          : { data: { [fieldName]: codes } }
      ),
    };


    try {
      // 请求拦截
      if (requestInterceptor) {
        config = await requestInterceptor(config);
      }

      // 发起请求（是否用重试逻辑）
      const fetchRequest = () => requestFn(config);
      const rawRes = retry > 0
        ? await withRetry(fetchRequest, { retry, delay: retryDelay, retryOn })
        : await fetchRequest();

      // 响应拦截
      const res = responseInterceptor ? await responseInterceptor(rawRes) : rawRes;

      // 判断请求是否成功
      if (!isSuccess(res)) {
        throw new Error('[DictManager] API 响应失败');
      }

      // 提取字典数据
      const dictList = parseResponseData(res) as TDict[];

      codes.forEach((code) => {
        // 解析获取字典数据
        const dict = parseDict(dictList, code, dictCodeKey);

        // 写缓存
        if (_shouldCache(code)) {
          _setCache(code, {
            data: dict,
            expireAt: cacheTime ? Date.now() + cacheTime : undefined,
          });
        }

        resolverMap.get(code)?.forEach(r => r.resolve(dict));

        resolverMap.delete(code);
      });
    } catch (err) {
      // 回调失败
      codes.forEach((code) => {
        const cached = cacheMap.get(code);
        if (cached && fallbackOnError) {
          // 降级：返回过期缓存 或 空数组
          resolverMap.get(code)?.forEach(r => r.resolve(cached.data ?? []));
        } else {
          // 不降级
          resolverMap.get(code)?.forEach(r => r.reject(err));
        }

        resolverMap.delete(code);
      });
    }
  }

  function _scheduleMerge() {
    if (!mergeTimer) {
      mergeTimer = setTimeout(() => _mergeRequest(), mergeDelay);
    }
  }


  /* ==================================================== 对外 API ==================================================== */

  /**
   * 获取字典数据
   * @param {string | string[]} code 字典 code
   * @param {FetchDictOptions} fetchOptions 单次请求配置
   * @param {boolean} fetchOptions.disableCache 强制不使用缓存
   * @return Promise<TDict[]> 字典数据对象结果, key 是字典编码
   */
  const fetchDict = async (code: string | string[], fetchOptions: FetchDictOptions = {}) => {
    const codes = Array.isArray(code) ? code : [code];
    const result: Record<string, Promise<any>> = {};

    codes.forEach((code) => {
      const canCache = _shouldCache(code, fetchOptions.disableCache);
      const cached = cacheMap.get(code);

      // 1. 命中缓存 未过期 → 返回并刷新 LRU 顺序
      if (canCache && cached && !_isExpired(cached)) {
        _touchCache(code);
        result[code] = Promise.resolve(cached.data);
        return;
      }

      // SWR：先返回旧数据，再后台刷新
      if (canCache && cached && _isExpired(cached)) {
        // 当前调用先使用旧缓存
        result[code] = Promise.resolve(cached.data);

        // 后台触发刷新（若当前没有在请求中）
        if (!resolverMap.has(code)) {
          pendingCodes.add(code);
          _scheduleMerge();
        }
        return;
      }

      // 已在合并队列中，复用同一次请求
      if (resolverMap.has(code)) {
        const p = new Promise<TDict>((resolve, reject) => {
          resolverMap.get(code)!.push({ resolve, reject });
        });
        result[code] = p;
        return;
      }

      // 新加入合并
      const p = new Promise<TDict>((resolve, reject) => {
        resolverMap.set(code, [{ resolve, reject }]);
        pendingCodes.add(code);
        _scheduleMerge();
      });
      result[code] = p;
    });

    // 返回 Promise
    const entries = await Promise.all(
      Object.entries(result).map(async ([k, p]) => [k, await p] as const),
    );


    const finalResult: Record<string, TDict> = {};
    entries.forEach(([k, v]) => {
      finalResult[k] = v;
    });
    return finalResult;
  };


  /**
   * 取消请求
   * - 尚未发出的合并请求定时器（还在 mergeDelay 等待窗口内）
   * - 已经发出但未完成的 HTTP 请求
   * - 拒绝所有等待结果的 Promise（reject(error)）
   *
   * @param {Error} reason 取消原因
   */
  const cancelFetch = (reason?: Error) => {
    // 1. 取消还未发出的合并请求
    if (mergeTimer) {
      clearTimeout(mergeTimer);
      mergeTimer = null;
    }

    // 2. 取消正在进行中的网络请求
    if (controller) {
      controller.abort();
      controller = null;
    }

    // 3. 拒绝所有仍在待合并队列中的 code
    const error = reason ?? new Error('[DictManager] Request cancelled');

    pendingCodes.forEach((code) => {
      resolverMap.get(code)?.forEach(r => r.reject(error));
      resolverMap.delete(code);
    });

    pendingCodes.clear();
  };


  /**
   * 删除缓存的字典
   * @param {string | string[]} code 字典 code/codes
   */
  const deleteCache = (code: string | string[]) => {
    const codes = Array.isArray(code) ? code : [code];
    codes?.forEach(code => cacheMap.delete(code));
    onCacheChange?.({ type: 'delete', codes });
  };

  /**
   * 清空缓存
   */
  const clearCache = () => {
    cacheMap.clear();
    onCacheChange?.({ type: 'clear' });
  };

  /**
   * 获取缓存的字典
   * @param {string} code 字典 code
   * @returns {CacheItem<TDict> | undefined} 缓存中的字典数据
   */
  const getDictCache = (code: string) => cacheMap.get(code);


  /**
   * 获取当前缓存条数
   * @returns {number} 缓存条数
   */
  const getCacheSize = () => cacheMap.size;


  /**
   * 获取当前缓存的 keys 集合
   * @returns {string[]} keys 集合
   */
  const getCacheKeys = () => Array.from(cacheMap.keys());


  return {
    fetchDict,
    cancelFetch,
    deleteCache,
    clearCache,
    getDictCache,
    getCacheSize,
    getCacheKeys,
  };
}


// 暴露的辅助工具函数 ============================================================
export {
  getDictItems,
  getDictLabel,
  getOptionLabel,
  listToTree,
  transformToOptions,
  treeToArray,
};


// 暴露 请求错误、NetworkError 类型 ============================================================
export type { HTTPError, NetworkError } from './helper';


// 暴露全部类型 ============================================================
export * from './types';

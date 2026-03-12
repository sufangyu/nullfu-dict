/**
 * 对象
 */
export type RecordBase<T = any> = Record<string, T>;


/**
 * 字典请求方法
 * - get
 * - post
 */
export type DictRequestMethod = 'get' | 'post';


/**
 * 请求头类型
 */
export type HeaderRecord = Record<string, string | number | boolean>;


/**
 * 请求头初始化类型
 * @description 函数返回值会作为请求头
 */
export type HeadersInitLike
  = | HeaderRecord
    | (() => HeaderRecord | Promise<HeaderRecord>);


/**
 * 请求配置
 */
export interface RequestConfig {
  url: string;
  /**
   * 请求方法
   */
  method: DictRequestMethod;
  /**
   * get 参数
   */
  params?: Record<string, any>;
  /**
   * post 参数
   */
  data?: Record<string, any>;
  /**
   * headers
   * @description 支持静态或动态
   */
  headers?: HeadersInitLike;
  /**
   * 请求取消
   */
  signal?: AbortSignal;
}


/** 单次请求配置 */
export interface FetchDictOptions {
  /** 强制不使用缓存 */
  disableCache?: boolean;
}


/**
 * 缓存项
 */
export interface CacheItem<T = any> {
  /**
   * 缓存数据
   */
  data: T;
  /**
   * 缓存过期时间
   */
  expireAt?: number;
}


/**
 * 字典请求函数
 * @param options 请求配置
 * @description 用于自定义请求实现
 */
export type DictRequestFn = (config: RequestConfig) => Promise<any>;


/**
 * 默认字典项类型
 */
export interface DictItemDefault {
  id?: string | number;
  /**
   * 父级 id
   */
  parentId?: string | number;
  /**
   * 名称
   */
  label?: string;
  /**
   * 编码
   */
  value?: string;
  /**
   * 是否可用
   * @description 与`disabled`存在对应关系
   *
   * - 1: 可用
   * - 0: 禁用
   */
  enabled?: string | number;
  /**
   * 是否禁用
   * @description 与 `enabled`存在对应关系
   */
  disabled?: boolean;
  /**
   * 层级,
   * @description
   * 只从树结构转成扁平数据时可能存在
   */
  level?: number;
  /**
   * 子项数据
   */
  children?: DictItemDefault[];
}


/**
 * 字典管理器配置
 */
export interface DictManagerOptions<
  TDict = DictItemDefault,
  TResponse = any,
> {
  /**
   * 请求前缀`URL`
   * @description 会在`url`不是绝对 URL 时拼接上
   */
  baseURL?: string;
  /**
   * 请求 API URL
   * @description 绝对 URL 时会忽略`baseURL`, 反之会拼接上`baseURL`
   */
  url: string;
  /**
   * HTTP 请求方法
   *
   * @default 'post'
   *
   * 支持:
   * - `'get'`
   * - `'post'`
   *
   * 当未指定时默认使用 `'post'`
   */
  method?: DictRequestMethod;
  /**
   * 请求头 headers
   * @description 支持静态或动态
   */
  headers?: HeadersInitLike;
  /**
   * 查询字典 code 的参数名
   * @default 'codes'
   */
  fieldName?: string;
  /**
   * 接口返回的字典 code 的字段名
   * @default 'value'
   */
  dictCodeKey?: string;
  /**
   * 是否启用缓存
   * @default true
   */
  cache?: boolean;
  /**
   * 缓存时间（ms）
   * @default 1小时 (1000 * 60 * 60）
   * @description 0 / undefined = 永久
   */
  cacheTime?: number;
  /**
   * 最大缓存条数
   * @default 100
   */
  maxCacheSize?: number;
  /**
   * 永不缓存的字典编码
   * 不指定时，会缓存所有请求
   */
  disabledCacheCodes?: string[];
  /**
   * 合并请求的时间窗口（ms）
   * @default 25 ms
   */
  mergeDelay?: number;
  /**
   * 重试次数
   * @default 0
   */
  retry?: number;
  /**
   * 重试间隔时间
   * @default 200 ms
   */
  retryDelay?: number;
  /**
   * 错误时是否回退到 fallbackDict
   * @default true
   */
  fallbackOnError?: boolean;

  /**
   * 自定义请求实现
   * @description 参数传入当前请求的配置信息（url, method, headers, data/params ）, 返回接口实际响应的数据。针对错误
   * 场景需要抛出异常`throw new HTTPError(res, body)`, 主要是错误状态码、信息等
   * @
   */
  requestFn?: (config: RequestConfig) => Promise<TResponse>;
  /**
   * 请求拦截器
   * @description 用于自定义请求处理
   */
  requestInterceptor?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  /**
   * 响应拦截器
   * @description 用于自定义响应处理
   */
  responseInterceptor?: (res: TResponse) => TResponse | Promise<TResponse>;

  /**
   * 判断请求是否成功
   * @param res 响应数据
   * @returns
   */
  isSuccess?: (res: TResponse) => boolean;
  /**
   * 解析实际的响应数据
   * @param res 原始响应数据
   * @returns
   */
  parseResponseData?: (res: TResponse) => TDict[];
  /**
   * 解析获取字典数据
   * @param dictList 字典列表
   * @param code 字典编码
   * @param codeKey 字典数据对应的键
   * @returns
   */
  parseDict?: (dictList: TDict[], code: string, codeKey: string) => TDict | undefined;

  /**
   * 是否触发重试的判断回调函数
   * @param error 错误信息
   * @returns
   */
  retryOn?: (error: any) => boolean;

  /**
   * 缓存变化回调
   * @description 用于 Devtools 或外部监听缓存变化
   */
  onCacheChange?: (event: {
    type: 'set' | 'delete' | 'clear',
    codes?: string[],
    code?: string,
  }) => void;
}

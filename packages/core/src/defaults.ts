import type { RequestConfig } from './types';
import { HTTPError, NetworkError, resolveHeaders } from './helper';

/**
 * 默认判断请求是否成功
 * @param res
 * @returns 请求是否成功结果
 */
export function defaultIsSuccess(res: any) {
  return res && res.success !== false;
}


/**
 * 默认解析实际响应数据
 * @param res 响应数据
 * @returns 实际字典数据
 */
export function defaultParseResponseData(res: any): any[] {
  if (!res || res.success === false) {
    return [];
  }

  return res.data ?? [];
}


/**
 * 默认解析获取字典数据
 * @param dictList 字典列表
 * @param code 字典编码
 * @param key 字典编码对应的 key
 * @returns 字典结果
 */
export function defaultParseDict(dictList: any[], code: string, key: string) {
  return dictList.find(it => it[key] === code);
}


/**
 * 默认请求处理函数
 * @param config 请求配置
 * @description fetch 实现
 * @returns 请求响应结果
 */
export async function defaultFetchRequest(config: RequestConfig) {
  const { url, method, params, data, headers, signal } = config;
  const finalHeaders = await resolveHeaders(headers);

  let finalUrl = url;
  if (method === 'get' && params) {
    const qs = new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
        acc[k] = Array.isArray(v) ? v.join(',') : String(v);
        return acc;
      }, {}),
    ).toString();

    finalUrl += qs ? `?${qs}` : '';
  }

  let res: Response;
  try {
    res = await fetch(finalUrl, {
      method: method.toUpperCase(),
      headers: { 'Content-Type': 'application/json', ...finalHeaders },
      body: method === 'post' ? JSON.stringify(data) : undefined,
      signal,
    });
  } catch (err) {
    // 主动取消（AbortError）不视为网络异常，直接透传，交由上层决定是否处理/重试
    if ((err as any)?.name === 'AbortError') {
      throw err;
    }

    throw new NetworkError(String(err));
  }

  // 手动抛错
  if (res === undefined || !res?.ok) {
    const body = await res?.text().catch(() => null);
    throw new HTTPError(res, body);
  }

  return res?.json();
}


/**
 * 默认重试判断
 * @param error 错误信息对象
 * @returns 是否重试结果
 */
export function defaultRetryOn(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as any;

  // 主动取消的错误不重试
  if (err && err.name === 'AbortError') {
    return false;
  }

  // 网络错误（无 status）
  if (err instanceof NetworkError) {
    return true;
  }


  // 提取 status（兼容 axios / fetch 自定义错误）
  const status = err.status ?? err.response?.status ?? err.cause?.status;

  if (typeof status === 'number') {
    // 只重试 5xx、429（限流）, 999 是`net::ERR_CONNECTION_CLOSED`
    return (status >= 500 && status < 600) || status === 429 || status === 999;
  }

  return false;
}

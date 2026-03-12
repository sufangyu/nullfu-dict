import type { HeadersInitLike } from './types';

/**
 * 失败重试
 * @param fn 函数
 * @param options 重试配置项
 * @param options.retry 重试次数
 * @param options.delay 重试间隔
 * @param options.retryOn 重试匹配函数,
 */
export async function withRetry(
  fn: () => Promise<any>,
  options: {
    retry: number,
    delay: number,
    retryOn?: (error: any) => boolean,
  },
) {
  const { retry, delay, retryOn } = options;

  let attempt = 0;
  let currentDelay = delay;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      const shouldRetry = retryOn ? retryOn(err) : true;

      if (!shouldRetry || attempt >= retry) {
        throw err;
      }

      console.warn(`[DictManager] 请求失败，第 ${attempt + 1} 次重试...`);
      await new Promise(r => setTimeout(r, currentDelay));

      currentDelay *= 2; // 指数退避
      attempt++;
    }
  }
}


/**
 * 处理请求头
 * @param headers
 * @returns 处理后的请求头
 */
export async function resolveHeaders(headers?: HeadersInitLike): Promise<Record<string, string>> {
  if (!headers) {
    return {};
  }

  const rawHeaders = typeof headers === 'function' ? await headers() : headers;

  const finalHeaders: Record<string, string> = {};
  Object.entries(rawHeaders).forEach(([k, v]) => {
    finalHeaders[k] = String(v);
  });

  return finalHeaders;
}


/**
 * 网络错误
 */
export class NetworkError extends Error {
  name = 'NetworkError';
  originalError: any;

  constructor(err: any) {
    super('Network request failed');
    this.originalError = err;
  }
}


/**
 * HTTP 错误
 */
export class HTTPError extends Error {
  /**
   * 错误名称
   */
  name = 'HTTPError';
  /**
   * 响应状态码
   */
  status: number;
  /**
   * 响应状态文本
   */
  statusText: string;
  /**
   * 请求 URL
   */
  url: string;
  /**
   * 响应对象
   */
  response?: Response;
  /**
   * 响应数据
   */
  body?: any;

  constructor(res: Response, body: any) {
    const { status = 999, statusText = '', url = '' } = res ?? {};
    super(`Request failed with status ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.response = res;
    this.body = body;
  }
}


/**
 * 判断 URL 是否是绝对路径
 * @param url
 * @returns 是否是绝对路径
 * @description 满足条件只有以`https://`, `http://`, `//` 开头的字符串
 */
export function isAbsoluteUrl(url: string) {
  const absoluteUrlReg = /^(?:[a-z]+:)?\/\//i;
  return absoluteUrlReg.test(url);
}


/**
 * 最终请求URL
 * @param baseURL 请求地址前缀
 * @param requestPath 请求地址
 * @returns 最终请求地址
 */
export function buildFullPath(baseURL: string, requestPath: string): string {
  const fullURL = `${baseURL}${requestPath}`;

  if (baseURL && requestPath) {
    const { pathname } = new URL(fullURL);
    if (pathname.startsWith('//')) {
      console.warn(`[DictManager] baseURL 和 URL 组合可能不正确: ${fullURL}`);
    }
  }

  return isAbsoluteUrl(requestPath) ? requestPath : fullURL;
}

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDictManager } from '../src/index';

/**
 * 验证 maxCacheSize 与 LRU 行为：
 * 1. 缓存条数不超过 maxCacheSize
 * 2. 读命中时该 key 会“刷新到前面”（移到 LRU 末尾，最晚被淘汰）
 */
describe('验证 maxCacheSize 与 LRU 行为', () => {
  const mockRequestFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // 每次请求返回的“字典列表”：按 codes 里每个 code 各一条，dictCode 为 code 名
    mockRequestFn.mockImplementation((config: any) => {
      const codes = config.params?.codes ?? config.data?.codes ?? [];
      return Promise.resolve({
        success: true,
        data: codes.map((code: string) => ({ dictCode: code, items: [] })),
      });
    });
  });

  it('缓存条数不超过 maxCacheSize，超出时淘汰最久未用的（Map 第一个）', async () => {
    const max = 5;
    const manager = createDictManager({
      url: '/api/dict',
      method: 'post',
      maxCacheSize: max,
      mergeDelay: 0,
      requestFn: mockRequestFn,
      parseResponseData: (res: any) => res?.data ?? [],
      parseDict: (list: any[], code: string) => list.find((x: any) => x.dictCode === code),
    });

    // 依次请求 5 个不同 code → 缓存 5 条
    await manager.fetchDict('A');
    await manager.fetchDict('B');
    await manager.fetchDict('C');
    await manager.fetchDict('D');
    await manager.fetchDict('E');

    expect(manager.getCacheSize()).toBe(5);
    expect(manager.getCacheKeys()).toEqual(['A', 'B', 'C', 'D', 'E']);

    // 再请求第 6 个 → 应淘汰 A，保留 B,C,D,E,F
    await manager.fetchDict('F');

    expect(manager.getCacheSize()).toBe(5);
    expect(manager.getCacheKeys()).toEqual(['B', 'C', 'D', 'E', 'F']);
    // A 已被淘汰，下次请求 A 会重新走网络
    const resA = await manager.fetchDict('A');
    expect(resA.A).toBeDefined();
    // mockRequestFn 是否被调用了 7 次？（5 + 1 次 F + 1 次 A）
    expect(mockRequestFn).toHaveBeenCalledTimes(7); // 6 + 1 次 A
  });

  it('读命中时该 key 会刷新到 LRU 末尾（之后满容量先淘汰别人）', async () => {
    const max = 4;
    const manager = createDictManager({
      url: '/api/dict',
      method: 'post',
      maxCacheSize: max,
      mergeDelay: 0,
      requestFn: mockRequestFn,
      parseResponseData: (res: any) => res?.data ?? [],
      parseDict: (list: any[], code: string) => list.find((x: any) => x.dictCode === code),
    });

    // 先塞满 4 个：顺序为 A, B, C, D
    await manager.fetchDict('A');
    await manager.fetchDict('B');
    await manager.fetchDict('C');
    await manager.fetchDict('D');
    expect(manager.getCacheKeys()).toEqual(['A', 'B', 'C', 'D']);

    // 再读一次 A（命中缓存）→ A 应移到末尾，顺序变为 B, C, D, A
    await manager.fetchDict('A');
    expect(manager.getCacheKeys()).toEqual(['B', 'C', 'D', 'A']);

    // 再请求 E，满容量应淘汰“最久未用”的 B，不是 A
    await manager.fetchDict('E');
    expect(manager.getCacheSize()).toBe(4);
    expect(manager.getCacheKeys()).toEqual(['C', 'D', 'A', 'E']);
  });
});

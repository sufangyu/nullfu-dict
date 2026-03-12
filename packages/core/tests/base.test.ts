import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDictManager } from '../src/index';

/**
 * 验证 基础功能:
 * 1. 是否会合并请求
 * 2. 是否缓存数据
 * 3. 是否会触发重试
 */
describe('验证 基础功能', () => {
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


  const DICT_A = 'dict-A';
  const DICT_B = 'dict-B';
  const DICT_C = 'dict-C';

  it('合并请求', async () => {
    vi.useFakeTimers();

    const manager = createDictManager({
      url: '/api/dict',
      method: 'post',
      mergeDelay: 1000,
      requestFn: mockRequestFn,
      parseResponseData: (res: any) => res?.data ?? [],
      parseDict: (list: any[], code: string) => list.find((x: any) => x.dictCode === code),
    });

    // 第一批：同步触发 A、B，合并定时器在 1000ms 后触发
    const pAB = Promise.all([
      manager.fetchDict(DICT_A),
      manager.fetchDict(DICT_B),
    ]);


    // 在合并窗口内（500ms）再请求 C，应和 A、B 同一批
    let pC: Promise<Record<string, any>>;
    setTimeout(() => {
      pC = manager.fetchDict(DICT_C);
    }, 500);

    await vi.advanceTimersByTimeAsync(500); // 执行 500ms 的 setTimeout，fetchDict(C) 被调用，C 进入同一批
    await vi.advanceTimersByTimeAsync(500); // 到 1000ms，合并定时器触发，只发 1 次请求

    const [resA, resB] = await pAB;
    const resC = await pC!;

    expect(mockRequestFn).toHaveBeenCalledTimes(1);
    expect(mockRequestFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/api/dict',
        data: { codes: expect.arrayContaining([DICT_A, DICT_B, DICT_C]) },
      }),
    );

    expect(resA[DICT_A]).toEqual({ dictCode: DICT_A, items: [] });
    expect(resB[DICT_B]).toEqual({ dictCode: DICT_B, items: [] });
    expect(resC[DICT_C]).toEqual({ dictCode: DICT_C, items: [] });

    vi.useRealTimers();
  });

  it('同Code只发一次请求', async () => {
    const manager = createDictManager({
      url: '/api/dict',
      method: 'post',
      requestFn: mockRequestFn,
      parseResponseData: (res: any) => res?.data ?? [],
      parseDict: (list: any[], code: string) => list.find((x: any) => x.dictCode === code),
    });

    // 同一合并窗口内并发请求多个 code，应只发 1 次请求且 codes 包含全部
    const [r1, r2] = await Promise.all([
      manager.fetchDict(DICT_A),
      manager.fetchDict(DICT_A),
    ]);

    expect(mockRequestFn).toHaveBeenCalledTimes(1);
    expect(mockRequestFn).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { codes: [DICT_A] },
      }),
    );
    expect(r1[DICT_A]).toEqual(r2[DICT_A]);
  });
});

import type { DictItemDefault } from '../types';
import { describe, expect, it } from 'vitest';
import { getDictItems, getDictLabel, getOptionLabel, listToTree, transformToOptions, treeToArray } from '../src/utils';


describe('getDictItems', () => {
  it('当字典为 null 或 undefined 时返回空数组', () => {
    expect(getDictItems(null as any)).toEqual([]);
    expect(getDictItems(undefined as any)).toEqual([]);
  });


  it('字典数据列表默认字段-children', () => {
    const dict = { children: [{ id: 1, dictName: 'a', dictCode: 'A' }] };
    expect(getDictItems(dict)).toEqual([{ id: 1, dictName: 'a', dictCode: 'A' }]);
  });


  it('字典数据列表自定义字段-items', () => {
    const dict = { items: [{ id: 1 }] };
    expect(getDictItems(dict, { childrenKey: 'items' })).toEqual([{ id: 1 }]);
  });


  it('字典数据-筛选启用（isEnable=1）', () => {
    // 自定义字典结构
    interface TDictItemCustom {
      id?: number;
      dictName?: string;
      dictCode?: string;
      isEnable?: string;
      children?: TDictItemCustom[];
    };

    const dict: TDictItemCustom = {
      children: [
        { id: 1, dictName: 'a', dictCode: 'A', isEnable: '1' },
        { id: 2, dictName: 'b', dictCode: 'B', isEnable: '0' },
      ],
    };

    const dictList = getDictItems(dict, { enabledOnly: true, enabledKey: 'isEnable' });
    expect(dictList).toEqual(
      [{ id: 1, dictName: 'a', dictCode: 'A', isEnable: '1' }],
    );
  });


  it('字典数据-自定义筛选条件', () => {
    // 自定义字典结构2
    interface TDictItemCustom2 {
      id?: number;
      dictName?: string;
      dictCode?: string;
      enabled?: boolean;
      children?: TDictItemCustom2[];
    };

    const dict: TDictItemCustom2 = {
      children: [
        { id: 1, enabled: true },
        { id: 2, enabled: false },
      ],
    };

    const dictList = getDictItems(
      dict,
      {
        enabledOnly: true,
        enabledKey: 'enabled',
        enabledOn: item => item.enabled,
      },
    );

    expect(dictList).toEqual(
      [{ id: 1, enabled: true }],
    );
  });
});


describe('getDictLabel', () => {
  const dictList = [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ];

  it('null, undefined, 空字符串匹配不上返回结果', () => {
    expect(getDictLabel(null, dictList)).toBe('-');
    expect(getDictLabel(undefined, dictList)).toBe('-');
    expect(getDictLabel('', dictList)).toBe('-');
    expect(getDictLabel(null, dictList, { placeholder: '--' })).toBe('--');
  });

  it('正常值匹配上返回结果', () => {
    expect(getDictLabel('1', dictList)).toBe('男');
    expect(getDictLabel(2, dictList)).toBe('女');
  });

  it('正常值匹配不上返回结果（包括自定义占位符）', () => {
    expect(getDictLabel('99', dictList)).toBe('99');
    expect(getDictLabel('x', dictList)).toBe('x');
    expect(getDictLabel('', dictList)).toBe('-');
    expect(getDictLabel(null, dictList, { placeholder: '未知' })).toBe('未知');
  });

  it('自定义匹配数据的 labelKey, valueKey', () => {
    const list = [{ name: '选项A', code: 'a' }];
    expect(getDictLabel('a', list, { labelKey: 'name', valueKey: 'code' })).toBe('选项A');
  });
});


describe('listToTree', () => {
  it('数组转树-通过 id 与 parentId关系', () => {
    const list: DictItemDefault[] = [
      { id: '1', parentId: '', label: '根', value: 'r', enabled: '1' },
      { id: '2', parentId: '1', label: '子', value: 'c', enabled: '1' },
    ];
    const tree = listToTree(list);
    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe('根');
    expect(tree[0].value).toBe('r');
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children![0].label).toBe('子');
  });

  it('数据是否启用根据 enabled = 1', () => {
    const list = [
      { id: '1', parentId: '', dictName: 'a', dictCode: 'a', isEnable: '0' },
    ];
    const tree = listToTree<typeof list[0], {
      label?: string,
      value?: string,
      isCanUsed?: boolean,
    }>(list, { labelRawKey: 'dictName', valueRawKey: 'dictCode', disabledRawKey: 'isEnable', disabledKey: 'isCanUsed' });
    expect(tree[0].isCanUsed).toBe(true);
  });

  it('自定义 idKey 和 parentIdKey', () => {
    const list = [
      { pk: '1', pid: null, label: 'a', value: 'a', isEnable: '1' },
      { pk: '2', pid: '1', label: 'b', value: 'b', isEnable: '1' },
    ];
    const tree = listToTree(list, { idKey: 'pk', parentIdKey: 'pid', disabledRawKey: 'isEnable' });
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
  });

  it('自定义转换最大层级, 超过层级的节点忽略', () => {
    const list = [
      { id: '1', parentId: '', label: 'L1', value: '1', isEnable: '1' },
      { id: '2', parentId: '1', label: 'L2', value: '2', isEnable: '1' },
      { id: '3', parentId: '2', label: 'L3', value: '3', isEnable: '1' },
    ];
    const tree = listToTree(list, { maxLevel: 2 });
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children![0].children).toBeUndefined();
  });

  it('自定义label, value后, 移除原始的key', () => {
    const list = [
      { id: '1', parentId: '', label: 'a', value: 'x', isEnable: '1' },
    ];
    const tree = listToTree(list, { labelKey: 'dictName', valueKey: 'dictCode' });
    expect(tree[0]).toHaveProperty('dictName', 'a');
    expect(tree[0]).toHaveProperty('dictCode', 'x');
    expect(tree[0]).not.toHaveProperty('label');
    expect(tree[0]).not.toHaveProperty('value');
  });

  it('自定义启用判断函数覆盖禁用数据', () => {
    const list = [
      { id: '1', parentId: '', dictName: 'a', dictCode: 'a', isEnable: '0' },
    ];
    const tree = listToTree(list, { enabledOn: () => true });
    expect(tree[0].disabled).toBe(false);
  });
});


describe('treeToArray', () => {
  it('树转数组, 带层级和父阶段信息', () => {
    const tree = [
      {
        id: '1',
        label: '根',
        value: 'r',
        disabled: false,
        children: [
          { id: '2', label: '子', value: 'c', disabled: false, children: [] },
        ],
      },
    ];
    const flat = treeToArray<typeof tree[0], {
      label: string,
      value: string,
      level: number,
      pid: string,
    }>(tree, { parentKey: 'pid' });
    expect(flat).toHaveLength(2);
    expect(flat[0].label).toBe('根');
    expect(flat[0].level).toBe(1);
    expect(flat[0].pid).toBe('');
    expect(flat[1].label).toBe('子');
    expect(flat[1].level).toBe(2);
    expect(flat[1].pid).toBe('1');
  });

  it('设置转换最大层级, 超过忽略', () => {
    const tree = [
      {
        id: '1',
        label: 'L1',
        value: '1',
        children: [
          {
            id: '2',
            label: 'L2',
            value: '2',
            children: [
              { id: '3', label: 'L3', value: '3', children: [] },
            ],
          },
        ],
      },
    ];
    const flat = treeToArray(tree, { maxLevel: 2 });
    expect(flat).toHaveLength(2);
  });

  it('自定义源数据 key 和转换后 key', () => {
    const tree = [
      {
        id: '1',
        name: 'n1',
        val: 'v1',
        children: [],
      },
    ];
    const flat = treeToArray(tree, {
      labelRawKey: 'name',
      valueRawKey: 'val',
      labelKey: 'label',
      valueKey: 'value',
    });
    expect(flat[0].label).toBe('n1');
    expect(flat[0].value).toBe('v1');
  });
});


describe('transformToOptions', () => {
  it('普通对象转换为带有标签/值的选项列表数据', () => {
    const obj = { a: 1, b: 2 };
    const opts = transformToOptions(obj);
    expect(opts).toEqual([
      { label: 'a', value: 1 },
      { label: 'b', value: 2 },
    ]);
  });

  it('枚举转换为带有标签/值的选项列表数据', () => {
    enum numEnum { A = 1, B = 2 };
    // enum => const 的结果是: const numEnum = { A: 1, B: 2, 1: 'A', 2: 'B' };
    const opts = transformToOptions(numEnum);
    expect(opts).toHaveLength(2);
    expect(opts.map(o => o.label)).toEqual(['A', 'B']);
  });

  it('自定义 labelKey, valueKey', () => {
    const obj = { x: 10 };
    const opts = transformToOptions(obj, { labelKey: 'text', valueKey: 'id' });
    expect(opts[0]).toEqual({ text: 'x', id: 10 });
  });

  it('转换过程自定义转换函数: transformLabel, transformValue', () => {
    const obj = { active: 1, inactive: 0 };
    const opts = transformToOptions(obj, {
      transformLabel: key => key.toUpperCase(),
      transformValue: v => (`${v}` === '1' ? '是' : '否'),
    });
    expect(opts).toEqual([
      { label: 'ACTIVE', value: '是' },
      { label: 'INACTIVE', value: '否' },
    ]);
  });
});


describe('getOptionLabel', () => {
  const options = [
    { label: '选项一', value: 1 },
    { label: '选项二', value: 2 },
  ];

  it('匹配不上: null/undefined/空字符串', () => {
    expect(getOptionLabel(null, options)).toBe('-');
    expect(getOptionLabel(undefined, options)).toBe('-');
    expect(getOptionLabel('', options)).toBe('-');
  });

  it('匹配上', () => {
    expect(getOptionLabel(1, options)).toBe('选项一');
    expect(getOptionLabel(2, options)).toBe('选项二');
  });

  it('自定义空值占位符', () => {
    expect(getOptionLabel(null, options, { placeholder: '请选择' })).toBe('请选择');
  });
});

import type { DictItemDefault, RecordBase } from './types';


/**
 * 获取某一字典配置的具体字典列表数据
 * @param dict 字典数据
 * @param options 配置项
 * @param options.childrenKey 子项数据字段名, 默认`children`
 * @param options.disabledKey 禁用字段名, 默认`disabled`
 * @param options.enabledKey 可用字段名, 默认`enabled`
 * @param options.enabledOnly 只返回启用项（条件: `item[enabledKey]='1' 或 `item[disabledKey] === true`, 支持使用`enabledOn`参数自定义）
 * @param options.enabledOn 自定义启用判断
 * @type TDictItem 字典数据类型
 * @type CKey 子项数字段名
 * @returns 当前字典的数据
 */
export function getDictItems<
  TDictItem extends RecordBase = DictItemDefault,
  CKey extends keyof TDictItem & string = string,
>(
  dict: TDictItem,
  options?: {
    /** 子项数据字段名, 默认`children` */
    childrenKey?: CKey,
    /** 禁用字段名, 默认`disabled` */
    disabledKey?: keyof TDictItem & string,
    /** 可用字段名, 默认`enabled` */
    enabledKey?: keyof TDictItem & string,
    /** 只返回启用项 */
    enabledOnly?: boolean,
    /** 自定义启用判断 */
    enabledOn?: (item: TDictItem) => boolean | undefined,
  },
): TDictItem[] {
  const {
    childrenKey = 'children',
    disabledKey = 'disabled',
    enabledKey = 'enabled',
    enabledOnly = false,
    enabledOn,
  } = options ?? {};

  if (!dict) {
    return [] as any;
  }

  const rawList: TDictItem[] = Array.isArray(dict[childrenKey])
    ? dict[childrenKey]
    : [];


  // 过滤可用项判断
  const isEnabledOn = (item: TDictItem) => {
    return typeof enabledOn === 'function'
      ? enabledOn(item)
      : (String(item?.[enabledKey]) === '1' || item?.[disabledKey] === true);
  };

  const list = enabledOnly ? rawList.filter(isEnabledOn) : rawList;
  return list;
}


/**
 * 根据字典的编码获取 label
 * @description 常用在界面显示格式化后字典标签
 * @param value 字典编码
 * @param dictList 字典列表数据
 * @param options 格式化配置项
 * @param options.labelKey 标签 key. 默认`label`
 * @param options.valueKey 字典编码 key. 默认`value`
 * @param options.placeholder 空值占位符. 默认`-`
 * @returns 标签结果
 */
export function getDictLabel<TDictItem extends RecordBase>(
  value: string | number | undefined | null,
  dictList: TDictItem[],
  options?: {
    labelKey?: keyof TDictItem & string,
    valueKey?: keyof TDictItem & string,
    placeholder?: string,
  },
): string | number {
  const {
    labelKey = 'label',
    valueKey = 'value',
    placeholder = '-',
  } = options ?? {};

  // 处理空值情况
  if (value === undefined || value === null || value === '') {
    return placeholder;
  }

  const item = dictList.find(i => String(i[valueKey]) === String(value));
  return item?.[labelKey] || value || placeholder;
}


/**
 * 扁平列表转树
 * @type TData 数组单项数据类型
 * @type TNode 转换后树结构节点类型
 * @param list 数据列表
 * @param options 配置项
 * @param options.idKey id 源字段名. 默认`id`
 * @param options.parentIdKey 父级 id 源字段名. 默认`parentId`
 * @param options.labelRawKey label 源字段名. 默认`label`
 * @param options.valueRawKey value 源字段名. 默认`value`
 * @param options.enabledRawKey 可用源字段名. 默认`enabled`
 * @param options.disabledRawKey 禁用源字段名. 默认`disabled`
 * @param options.labelKey label 结果字段名. 默认`label`
 * @param options.valueKey value 结果字段名. 默认`value`
 * @param options.disabledKey disabled 结果字段名. 默认`disabled`
 * @param options.childrenKey 子项数据结果字段名. 默认`children`
 * @param options.enabledOn 自定义启用判断
 * @param options.maxLevel 最大层级, 从 1 开始
 * @param options.cleanSource 是否映射后删除源字段. 默认`true`
 */
export function listToTree<
  TDictItem extends RecordBase = DictItemDefault,
  TNodeItem extends RecordBase = DictItemDefault,
>(
  list: TDictItem[],
  options?: {
  /** id 源字段名 */
    idKey?: keyof TDictItem & string,
    /** 父级 id 源字段名 */
    parentIdKey?: keyof TDictItem & string,
    /** label 源字段名 */
    labelRawKey?: keyof TDictItem & string,
    /** value 源字段名 */
    valueRawKey?: keyof TDictItem & string,
    /** 启用源字段名 */
    enabledRawKey?: keyof TDictItem & string,
    /** 禁用源字段名 */
    disabledRawKey?: keyof TDictItem & string,

    /** label 结果字段名 */
    labelKey?: keyof TNodeItem & string,
    /** value 结果字段名 */
    valueKey?: keyof TNodeItem & string,
    /** disabled 结果字段名 */
    disabledKey?: keyof TNodeItem & string,
    /** 子项数据结果字段名 */
    childrenKey?: keyof TNodeItem & string,

    /** 启用判断函数（优先级高于 enableKey） */
    enabledOn?: (item: TDictItem) => boolean,
    /** 最大层级（从 1 开始） */
    maxLevel?: number,
    /** 映射后删除源字段 */
    cleanSource?: boolean,
  },
): TNodeItem[] {
  type KDictItem = keyof TDictItem & string;
  type KNodeItem = keyof TNodeItem & string;

  const {
    idKey = 'id' as KDictItem,
    parentIdKey = 'parentId' as KDictItem,
    labelRawKey = 'label' as KDictItem,
    valueRawKey = 'value' as KDictItem,
    enabledRawKey = 'enabled' as KDictItem,
    disabledRawKey = 'disabled' as KDictItem,

    labelKey = 'label' as KNodeItem,
    valueKey = 'value' as KNodeItem,
    disabledKey = 'disabled' as KNodeItem,
    childrenKey = 'children' as KNodeItem,

    enabledOn,
    maxLevel,
    cleanSource = true,
  } = options ?? {};


  const nodeMap = new Map<string, any>();
  const roots: TNodeItem[] = [];

  // 1. 创建节点（处理自定义 key 映射）
  for (const item of list) {
    const node = { ...item } as any;

    // label / value 映射
    node[labelKey] = item[labelRawKey];
    node[valueKey] = item[valueRawKey];
    node[childrenKey] = [];

    // 可用判断
    const isEnabledOn = typeof enabledOn === 'function'
      ? enabledOn
      : (item: TDictItem) => String(item?.[enabledRawKey]) === '1' || item?.[disabledRawKey] === true;

    // 禁用结果
    node[disabledKey] = !isEnabledOn(node);

    // 删除映射的源字段
    if (cleanSource) {
      labelKey !== labelRawKey && delete node[labelRawKey];
      valueKey !== valueRawKey && delete node[valueRawKey];
      disabledKey !== disabledRawKey && delete node[disabledRawKey];
      delete node[enabledRawKey];
    }

    nodeMap.set(String(item[idKey]), node);
  }


  // 2. 建立父子关系
  for (const item of list) {
    const id = String(item[idKey]);
    const parentId = item[parentIdKey];

    const node = nodeMap.get(id)!;
    const parentNode = parentId ? nodeMap.get(String(parentId)) : null;

    if (parentNode) {
      parentNode[childrenKey].push(node);
    } else {
      roots.push(node);
    }
  }


  // 3. 层级裁剪
  if (maxLevel) {
    const trim = (nodes: any[], level: number) => {
      if (level >= maxLevel) {
        nodes.forEach(n => delete n[childrenKey]);
        return;
      }

      nodes.forEach((n) => {
        if (n[childrenKey]) {
          trim(n[childrenKey], level + 1);
        }
      });
    };
    trim(roots, 1);
  }

  return roots;
}


/**
 * 树转扁平数组
 * @type TData 数组单项数据类型
 * @type TNode 转换后树结构节点类型
 * @param tree 树结构数据
 * @param options
 * @param options.labelRawKey label 源字段名. 默认`label`
 * @param options.valueRawKey value 源字段名. 默认`value`
 * @param options.disabledRawKey disabled 源字段名. 默认`disabled`
 * @param options.childrenRawKey children 源字段名. 默认`children`
 * @param options.labelKey label 结果字段名. 默认`label`
 * @param options.valueKey value 结果字段名. 默认`value`
 * @param options.disabledKey disabled 结果字段名. 默认`disabled`
 * @param options.levelKey level 结果字段名. 默认`level`
 * @param options.parentKey parent 结果字段名. 默认`parentId`
 * @param options.idKey id 结果字段名. 默认`id`
 * @param options.transformer 转换器, 可进行增强处理
 * @param options.maxLevel 最大层级
 * @param options.cleanSource 是否映射后删除源字段. 默认`true`
 */
export function treeToArray<
  TNodeItem extends RecordBase = DictItemDefault,
  TDictItem extends RecordBase = DictItemDefault,
>(
  tree: TNodeItem[],
  options?: {
    /** label 源字段名 */
    labelRawKey?: keyof TNodeItem & string,
    /** value 源字段名 */
    valueRawKey?: keyof TNodeItem & string,
    /** disabled 源字段名 */
    disabledRawKey?: keyof TNodeItem & string,
    /** children 源字段名 */
    childrenRawKey?: keyof TNodeItem & string,

    /** label 结果字段名 */
    labelKey?: keyof TDictItem & string,
    /** value 结果字段名 */
    valueKey?: keyof TDictItem & string,
    /** disabled 结果字段名 */
    disabledKey?: keyof TDictItem & string,
    /** level 结果字段名 */
    levelKey?: keyof TDictItem & string,
    /** parent 结果字段名 */
    parentKey?: keyof TDictItem & string,
    /** id 结果字段名 */
    idKey?: keyof TDictItem & string,
    /**
     * 转换器, 可扩展处理
     * @param node 源节点
     * @param dictItem 转换后字典项
     * @param cleanSource 是否映射后删除源字段
     */
    transformer?: (node: TNodeItem, dictItem: TDictItem, cleanSource?: boolean) => void,
    /** 最大层级（从 1 开始） */
    maxLevel?: number,
    /** 映射后删除源字段 */
    cleanSource?: boolean,
  },
): TDictItem[] {
  const {
    labelRawKey = 'label',
    valueRawKey = 'value',
    disabledRawKey = 'disabled',
    childrenRawKey = 'children',

    labelKey = 'label',
    valueKey = 'value',
    disabledKey = 'disabled',
    levelKey = 'level',
    parentKey = 'parentId',
    idKey = 'id',
    transformer,

    maxLevel,
    cleanSource = true,
  } = options ?? {};

  const result: TDictItem[] = [];

  const traverse = (nodes: TNodeItem[], parentId?: unknown, level = 1) => {
    for (const node of nodes) {
      if (maxLevel && level > maxLevel) {
        return;
      }

      const { [childrenRawKey]: children, ...rest } = node;
      const flatNode = { ...rest } as any;

      // 自定义 key 映射: label, value, disabled, children
      flatNode[labelKey] = node[labelRawKey];
      flatNode[valueKey] = node[valueRawKey];
      flatNode[disabledKey] = node[disabledRawKey];


      // 删除映射的源字段
      if (cleanSource) {
        labelRawKey !== labelKey && delete flatNode[labelRawKey];
        valueRawKey !== valueKey && delete flatNode[valueRawKey];
        disabledRawKey !== disabledKey && delete flatNode[disabledRawKey];
      }


      // // 额外字段: 层级值, 父级关系
      if (levelKey) {
        flatNode[levelKey] = level;
      }

      // 增加 父级 字段
      if (parentKey) {
        flatNode[parentKey] = parentId || '';
      }

      // 转换器, 可扩展处理
      transformer?.(node, flatNode, cleanSource);

      result.push(flatNode as TDictItem);

      if (children && children.length > 0) {
        traverse(
          children,
          idKey ? node[idKey] : undefined,
          level + 1,
        );
      }
    }
  };

  traverse(tree);

  return result;
}


// 硬编码的字典 工具函数 --------------------------------------------------------------------------------

/**
 * 将枚举 或 普通对象转换为选项数据列表数据
 * @description 支持自定义 labelKey / valueKey
 *
 * @param data 选项数据列表
 * @param options 配置项
 * @param options.labelKey label 字段名, 默认`label`
 * @param options.valueKey value 字段名, 默认`value`
 * @param options.transformLabel label 转换函数
 * @param options.transformValue value 转换函数
 * @param options.extra 额外属性
 * @type TData 源数据类型
 * @type KLabel  label 结果字段名
 * @type KValue  value 结果字段名
 * @type TExtra 额外属性
 */
export function transformToOptions<
  TData extends Record<string, any>,
  KLabel extends string = 'label',
  KValue extends string = 'value',
  TExtra extends Record<string, any> = object,
>(
  data: TData,
  options?: {
    /** label 字段名，默认 'label' */
    labelKey?: KLabel,
    /** value 字段名，默认 'value' */
    valueKey?: KValue,
    /** label 转换函数（可选） */
    transformLabel?: (key: string, value: TData[keyof TData]) => string,
    /** value 转换函数（可选） */
    transformValue?: (value: TData[keyof TData], key: string) => any,
    /** 额外属性 */
    extra?: (key: string, value: TData[keyof TData]) => TExtra,
  },
): (Record<KLabel, string> & Record<KValue, any> & TExtra)[] {
  const {
    labelKey = 'label' as KLabel,
    valueKey = 'value' as KValue,
    transformLabel,
    transformValue,
    extra,
  } = options || {};

  return Object.keys(data)
    .filter(key => Number.isNaN(Number(key))) // 处理数字 enum 反向映射
    .map((key) => {
      const rawValue = data[key];

      return {
        [labelKey]: transformLabel ? transformLabel(key, rawValue) : key,
        [valueKey]: transformValue ? transformValue(rawValue, key) : rawValue,
        ...(extra ? extra(key, rawValue) : {}),
      } as Record<KLabel, string> & Record<KValue, any> & TExtra;
    });
}


/**
 * 获取选项的 label 文案
 * @description 基于`getDictLabel`实现
 *
 * @param value 值
 * @param list 数据列表
 * @param options 格式化配置项
 * @param options.labelKey label 字段名. 默认`label`
 * @param options.valueKey value 字段名. 默认`value`
 * @param options.placeholder 空值占位符. 默认`-`
 */
export function getOptionLabel<
  TData extends Record<string, any> = { label?: string, value?: string | number | boolean },
>(
  value: string | number | undefined | null,
  list: TData[],
  options?: {
    /** label 字段名. 默认`label` */
    labelKey?: keyof TData & string,
    /** value 字段名. 默认`value` */
    valueKey?: keyof TData & string,
    /** 空值占位符. 默认`-` */
    placeholder?: string,
  },
): string | number {
  const { labelKey = 'label', valueKey = 'value', placeholder = '-' } = options ?? {};
  return getDictLabel(
    value,
    list,
    { labelKey, valueKey, placeholder },
  );
}


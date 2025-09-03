// 预设分类列表
export const PRESET_CATEGORIES = [
  'Programming',
  'Life',
] as const;

// 分类类型
export type Category = typeof PRESET_CATEGORIES[number];

// 获取所有分类
export const getCategories = (): Category[] => {
  return [...PRESET_CATEGORIES];
};

// 验证分类是否有效
export const isValidCategory = (category: string): category is Category => {
  return PRESET_CATEGORIES.includes(category as Category);
};

import { Category } from '@shared/types/product/Category';
import { Category as EntityCategory } from '@/types/entity/category';
import { Locale } from '@/project.config';

export const mapCategory = (category: Category, { locale = 'en-us' }: { locale?: Locale } = {}): EntityCategory => {
  return {
    categoryId: category.categoryId ?? '',
    categoryKey: category.slug,
    name: category.name ?? '',
    path: category._url?.[`${locale.split('-')[0]}-${locale.split('-')[1].toUpperCase()}`] ?? '',
    paths: Object.fromEntries(Object.entries(category._url ?? {}).map(([key, value]) => [key.toLowerCase(), value])),
    descendants: category.descendants?.map((c) => mapCategory(c, { locale })) ?? [],
  };
};

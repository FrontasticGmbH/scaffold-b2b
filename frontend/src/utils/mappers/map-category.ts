import { Category } from '@shared/types/product/Category';
import { Category as EntityCategory } from '@/types/entity/category';
import { Locale } from '@/project.config';
import { getLocalizationInfo } from '../../project.config';

export const mapCategory = (category: Category, { locale = 'en-us' }: { locale?: Locale } = {}): EntityCategory => {
  return {
    categoryId: category.categoryId ?? '',
    categoryKey: category.slug,
    name: category.name ?? '',
    path: category._url?.[getLocalizationInfo(locale).locale] ?? '',
    paths: Object.fromEntries(
      Object.entries(category._url ?? {}).flatMap(([key, value]) => [
        [key.split('-')[0], value],
        [key.toLowerCase(), value],
      ]),
    ),
    descendants: category.descendants?.map((c) => mapCategory(c, { locale })) ?? [],
  };
};

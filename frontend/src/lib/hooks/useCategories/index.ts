import { useCallback } from 'react';
import { sdk } from '@/sdk';
import { Category } from '@shared/types/product/Category';
import useSWR from 'swr';

export const useCategories = () => {
  const { data: categoriesData, mutate: mutateCategories } = useSWR('/action/product/queryCategories?format=tree', () =>
    sdk.composableCommerce.product.queryCategories({ format: 'tree', limit: 99 }),
  );

  const { data: flatCategoriesData, mutate: mutateFlatCategories } = useSWR(
    '/action/product/queryCategories?format=flat',
    () => sdk.composableCommerce.product.queryCategories({ format: 'flat', limit: 99 }),
  );

  const categories = categoriesData?.isError ? [] : ((categoriesData?.data.items as Category[]) ?? []);
  const flatCategories = flatCategoriesData?.isError ? [] : ((flatCategoriesData?.data.items as Category[]) ?? []);

  const mutate = useCallback(() => {
    mutateCategories();
    mutateFlatCategories();
  }, [mutateCategories, mutateFlatCategories]);

  return { categories, flatCategories, mutate };
};

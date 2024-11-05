import { sdk } from '@/sdk';
import { Category } from '@shared/types/product/Category';
import useSWR from 'swr';

export const useCategories = () => {
  const { data, mutate } = useSWR('/action/product/queryCategories', () =>
    sdk.composableCommerce.product.queryCategories({ format: 'tree', limit: 99 }),
  );

  const categories = data?.isError ? [] : ((data?.data.items as Category[]) ?? []);

  return { categories, mutate };
};

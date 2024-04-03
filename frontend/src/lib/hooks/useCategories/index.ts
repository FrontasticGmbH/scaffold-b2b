import { sdk } from '@/sdk';
import { Category } from '@shared/types/product/Category';
import useSWR from 'swr';

export const useCategories = () => {
  const { data } = useSWR('/action/product/queryCategories', () =>
    sdk.composableCommerce.product.queryCategories({ format: 'tree', limit: 99 }),
  );

  if (data?.isError) return { categories: [] };

  const categories = (data?.data.items as Category[]) ?? [];

  return { categories };
};

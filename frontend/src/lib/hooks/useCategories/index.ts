import { sdk } from '@/sdk';
import { Category } from '@shared/types/product/Category';
import { Result } from '@shared/types/product/Result';
import useSWR from 'swr';

export const useCategories = () => {
  const { data } = useSWR('/action/product/queryCategories', () =>
    sdk.callAction<Result>({ actionName: 'product/queryCategories', query: { format: 'tree' } }),
  );

  if (data?.isError) return { categories: [] };

  const categories = (data?.data.items as Category[]) ?? [];

  return { categories };
};

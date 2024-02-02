import { sdk } from '@/sdk';
import { Product } from '@shared/types/product';
import useSWR from 'swr';
import { ProductQueryQuery } from '@/sdk/composable-commerce-b2b/types/queries/ProductQueries';

const useProduct = (query: ProductQueryQuery | undefined) => {
  const { data } = useSWR(['/action/product/query', query], () => sdk.composableCommerce.product.query(query));
  return data?.isError ? [] : (data?.data.items as Product[]) ?? [];
};

export default useProduct;

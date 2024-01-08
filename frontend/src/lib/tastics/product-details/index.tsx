import { redirect } from 'next/navigation';
import ProductDetailsMapper from './components/ProductDetailsMapper';
import { ProductDetailsTasticProps } from './types';

const ProductDetailsTastic = ({ data }: ProductDetailsTasticProps) => {
  if (!data.data?.dataSource?.product) return redirect('/404');

  return <ProductDetailsMapper product={data.data.dataSource.product} />;
};

export default ProductDetailsTastic;

import { redirect } from 'next/navigation';
import { ProductDetailsTasticProps } from './types';
import ProductDetailsClientWrapper from './components/product-details-client-wrapper';

const ProductDetailsTastic = (props: ProductDetailsTasticProps) => {
  if (!props.data.data?.dataSource?.product) return redirect('/404');

  return <ProductDetailsClientWrapper {...props} />;
};

export default ProductDetailsTastic;

import { ProductAttributesProps } from './types';
import ProductAttribute from './components/product-attribute';

const ProductAttributes = ({ className, attributes }: ProductAttributesProps) => {
  return (
    <div className={className}>
      {attributes?.map((attribute, index) => (
        <ProductAttribute key={index} attribute={attribute} />
      ))}
    </div>
  );
};

export default ProductAttributes;

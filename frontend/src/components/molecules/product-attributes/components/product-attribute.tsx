import { ProductAttributeProps } from '../types';

const ProductAttribute = ({ attribute: { label, value } }: ProductAttributeProps) => {
  return (
    <div className="flex gap-2">
      <span>{`${label}:`}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default ProductAttribute;

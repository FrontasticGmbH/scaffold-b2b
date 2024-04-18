import Typography from '@/components/atoms/typography';
import { ProductAttributeProps } from '../types';

const ProductAttribute = ({ attribute: { label, value } }: ProductAttributeProps) => {
  return (
    <div className="flex gap-2">
      <Typography as="span">{`${label}:`}</Typography>
      <Typography as="span" fontWeight="medium">
        {value}
      </Typography>
    </div>
  );
};

export default ProductAttribute;

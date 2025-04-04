import React from 'react';
import QuantityWidget from '@/components/atoms/quantity-widget';
import { ProductItemProps } from '../../../types';

const ProductItem = ({ product, quantity, handleQuantityChange }: ProductItemProps) => {
  return (
    <div className="flex items-center justify-between pb-3">
      <div className="w-[45%] rounded-sm bg-neutral-200 px-2 py-3 lg:w-[55%]">
        <p className="truncate text-16 text-gray-700">{product.sku}</p>
      </div>
      <div className="ml-2 p-1 lg:ml-3">
        <QuantityWidget
          value={quantity}
          maxValue={product?.maxQuantity}
          showLabel={false}
          onChange={(value) => {
            handleQuantityChange(product, value);
          }}
        />
      </div>
    </div>
  );
};

export default ProductItem;

import Button from '@/components/atoms/button';
import QuantityWidget from '@/components/atoms/quantity-widget';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { CartCTAProps } from '../types';

const CartCTA = ({ product, addToCart, countChange, addToCartDisabled }: CartCTAProps) => {
  const translate = useTranslations();

  const [count, setCount] = useState(1);

  const handleCountChange = (count: number) => {
    countChange(count);
    setCount(count);
  };

  return (
    <div className="flex w-full gap-3">
      <QuantityWidget
        showLabel={false}
        value={product.inStock ? count : 0}
        minValue={Math.min(1, product.maxQuantity ?? Infinity)}
        maxValue={product.maxQuantity}
        onChange={handleCountChange}
        disabled={addToCartDisabled || !product.inStock}
      />
      <Button
        onClick={async () => {
          await addToCart(count);
          setCount(1);
        }}
        className="grow"
        size="m"
        disabled={addToCartDisabled}
      >
        {translate('cart.add')}
      </Button>
    </div>
  );
};

export default CartCTA;

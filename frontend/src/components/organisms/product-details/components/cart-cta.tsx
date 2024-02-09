import { useState } from 'react';
import Button from '@/components/atoms/button';
import QuantityWidget from '@/components/atoms/quantity-widget';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { CartCTAProps } from '../types';

const CartCTA = ({ addToCart, countChange }: CartCTAProps) => {
  const { translate } = useTranslation();

  const [count, setCount] = useState(1);

  const handleCountChange = (count: number) => {
    countChange(count);
    setCount(count);
  };

  return (
    <div className="flex w-full gap-3">
      <QuantityWidget showLabel={false} defaultValue={1} onChange={handleCountChange} />
      <Button onClick={() => addToCart(count)} className="grow" size="m">
        {translate('cart.add')}
      </Button>
    </div>
  );
};

export default CartCTA;

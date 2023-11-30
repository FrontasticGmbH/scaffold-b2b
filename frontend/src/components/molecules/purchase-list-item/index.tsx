import React, { useCallback, useState } from 'react';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/button';
import useFormat from '@/hooks/useFormat';
import QuantityWidget from '@/components/atoms/quantity-widget';
import StockIndicator from '@/components/atoms/stock-indicator';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { PurchaseListItemProps } from './types';
import ShowMore from '../show-more';
import RemoveButton from './components/remove-button';

const PurchaseListItem = ({
  item: {
    name,
    inStock,
    manufacturer,
    model,
    pressure,
    price,
    partNumber,
    currency,
    image,
    quantity,
    weight,
    maxQuantity,
  },
  onRemove,
  onAddToCart,
  onQuantityChange,
}: PurchaseListItemProps) => {
  const { translate } = useTranslation();

  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true);
    await onAddToCart?.();
    setAddingToCart(false);
  }, [onAddToCart]);

  const { formatCurrency } = useFormat();

  return (
    <div className="rounded-lg border border-neutral-400 p-4 md:flex md:items-start md:p-6">
      <div className="flex items-center justify-between md:hidden">
        <StockIndicator inStock={inStock} />
        <RemoveButton onRemove={onRemove} />
      </div>

      <div className="relative mx-auto mt-2 h-[124px] w-[124px] md:mr-8 md:h-[140px] md:w-[140px]">
        <Image fill src={image} alt={name} />
      </div>

      <div className="md:grow">
        <div>
          <p className="max-w-full truncate text-16 font-semibold leading-loose text-gray-700">{name}</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-12 leading-loose text-gray-600">
              {translate('common.model')}# {model}
            </p>
            <div className="hidden md:block">
              <StockIndicator inStock={inStock} />
            </div>
          </div>
        </div>

        <div className="mt-3 text-14 leading-[200%] text-gray-700">
          <p>
            {translate('common.manufacturer')} - <span className="font-semibold">{manufacturer}</span>
          </p>
          <p>
            {translate('common.part.number')} - <span className="font-semibold">{partNumber}</span>
          </p>
          {(pressure || weight) && (
            <ShowMore>
              <p>
                {translate('common.pressure')} - <span className="font-semibold">{pressure}</span>
              </p>
              <p>
                {translate('common.weight')} - <span className="font-semibold">{weight}</span>
              </p>
            </ShowMore>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-start gap-8 md:mt-0 md:shrink-0 md:self-stretch md:text-end">
        <div className="hidden md:block">
          <RemoveButton onRemove={onRemove} />
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="hidden lg:block">
            <QuantityWidget value={quantity} onChange={onQuantityChange} maxValue={maxQuantity} />
          </div>
          <span className="text-18 font-bold text-gray-800">{formatCurrency(price, currency)}</span>
          <Button
            variant="secondary"
            size="m"
            className="min-w-[150px]"
            onClick={handleAddToCart}
            loading={addingToCart}
          >
            {translate('cart.add')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseListItem;

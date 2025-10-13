import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import QuantityWidget from '@/components/atoms/quantity-widget';
import StockIndicator from '@/components/atoms/stock-indicator';
import useFormat from '@/hooks/useFormat';
import { Fragment, useCallback, useState } from 'react';
import { useTranslations } from 'use-intl';
import ProductAttributes from '../product-attributes';
import ShowMore from '../show-more';
import RemoveButton from './components/remove-button';
import { PurchaseListItemProps } from './types';

const PurchaseListItem = ({
  item: { name, inStock, sku, url, price, currency, image, quantity, maxQuantity, specifications },
  onRemove,
  onAddToCart,
  onQuantityChange,
}: PurchaseListItemProps) => {
  const translate = useTranslations();
  const maxDescriptionItems = 3;
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true);
    await onAddToCart?.();
    setAddingToCart(false);
  }, [onAddToCart]);

  const { formatCurrency } = useFormat();

  const handleRemove = useCallback(async () => {
    onRemove?.();
  }, [onRemove]);

  return (
    <div className="rounded-lg border border-neutral-400 p-4 md:flex md:items-start md:p-6">
      <div className="flex items-center justify-between md:hidden">
        <StockIndicator inStock={inStock} />
        <RemoveButton onRemove={handleRemove} />
      </div>

      <Link href={url}>
        <div className="relative mx-auto mt-2 size-[124px] shrink-0 md:mr-8 md:size-[140px]">
          <Image fill src={image} alt={name} />
        </div>
      </Link>

      <div className="overflow-x-hidden md:grow">
        <div>
          <Link href={url} className="max-w-full truncate text-16 font-semibold leading-loose text-gray-700">
            {name}
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-12 leading-loose text-gray-600">
              {translate('common.model')}# {sku}
            </p>
            <div className="hidden md:block">
              <StockIndicator inStock={inStock} />
            </div>
          </div>
        </div>

        <div className="mt-6 text-14 text-gray-700">
          {specifications && (
            <Fragment>
              <ProductAttributes
                className="mb-2 grid gap-2 leading-[135%]"
                attributes={specifications.slice(0, maxDescriptionItems)}
              />
              {specifications.length > maxDescriptionItems && (
                <ShowMore>
                  <ProductAttributes
                    className="mb-3 grid gap-2 leading-[135%]"
                    attributes={specifications.slice(maxDescriptionItems)}
                  />
                </ShowMore>
              )}
            </Fragment>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-start gap-8 md:mt-0 md:shrink-0 md:self-stretch md:text-end">
        <div className="hidden md:block">
          <RemoveButton onRemove={handleRemove} />
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="hidden lg:block">
            <QuantityWidget
              value={quantity}
              onChange={onQuantityChange}
              minValue={Math.min(1, maxQuantity ?? Infinity)}
              maxValue={maxQuantity}
            />
          </div>

          {price > 0 && <span className="text-18 font-bold text-gray-800">{formatCurrency(price, currency)}</span>}

          <Button
            variant="secondary"
            size="m"
            className="min-w-[150px]"
            onClick={handleAddToCart}
            loading={addingToCart}
            disabled={!inStock}
          >
            {translate('cart.add')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseListItem;

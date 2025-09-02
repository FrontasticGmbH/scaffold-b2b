import React, { useCallback, useState } from 'react';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/button';
import useFormat from '@/hooks/useFormat';
import QuantityWidget from '@/components/atoms/quantity-widget';
import StockIndicator from '@/components/atoms/stock-indicator';
import { classnames } from '@/utils/classnames/classnames';
import useDiscount from '@/hooks/useDiscount';
import { useTranslations } from 'use-intl';
import Link from '@/components/atoms/link';
import { ProductTileProps } from './types';
import ShowMore from '../show-more';
import DiscountTag from './components/discount-tag';
import ProductAttributes from '../product-attributes';

const ProductTile = ({
  item: {
    name,
    specifications,
    inStock,
    sku,
    price,
    discountedPrice,
    currency,
    images,
    maxQuantity = Number.MAX_VALUE,
    restockableInDays,
    url,
  },
  onAddToCart,
  addToCartDisabled = false,
  variant = 'list-item',
  className = '',
}: ProductTileProps) => {
  const translate = useTranslations();

  const [addingToCart, setAddingToCart] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true);
    await onAddToCart?.(quantity);
    setAddingToCart(false);
    setQuantity(1);
  }, [onAddToCart, quantity]);

  const { formatCurrency } = useFormat();

  const { isDiscounted, discountPercentage } = useDiscount(price, discountedPrice);

  const descriptionItems = (specifications ?? []).filter((item) => !!item.value);

  const maxDescriptionItems = 3;
  const hasPriceAndIsInStock = !!price && inStock;

  return (
    <div
      className={classnames(
        'relative border border-neutral-400 p-4',
        {
          'lg:pb-6': variant === 'grid-item',
          'md:flex md:items-start md:p-6 lg:py-12': variant === 'list-item',
        },
        className,
      )}
    >
      {isDiscounted && (
        <DiscountTag
          discountPercentage={discountPercentage}
          className={classnames('absolute left-0 top-4', { 'md:top-2': variant === 'list-item' })}
        />
      )}
      <div
        className={classnames('flex items-center justify-end', {
          'md:hidden': variant === 'list-item',
        })}
      >
        {price ? (
          <StockIndicator inStock={inStock} restockableInDays={restockableInDays} />
        ) : (
          <span className="text-red-500">{translate('common.not-available')}</span>
        )}
      </div>

      <Link href={url ?? '#'}>
        <div
          className={classnames('relative mx-auto my-3 size-[124px] shrink-0 md:mb-9 md:mt-6', {
            'md:mr-8 md:size-[140px]': variant === 'list-item',
            'md:size-[160px]': variant === 'grid-item',
          })}
        >
          <Image fill src={images?.[0]} suffix="small" alt={name} style={{ objectFit: 'contain' }} />
        </div>
      </Link>

      <div className={classnames('overflow-hidden px-1', { 'md:grow': variant === 'list-item' })}>
        <div>
          <Link
            href={url ?? '#'}
            className="mt-1 block max-w-full truncate py-1 text-16 font-semibold leading-loose text-gray-700"
          >
            {name}
          </Link>
          {sku && (
            <p className="mt-1 text-12 uppercase leading-loose text-gray-600">
              {translate('common.model')}# {sku}
            </p>
          )}
        </div>

        {variant === 'list-item' && (
          <>
            <ProductAttributes
              className="mt-3 grid gap-1"
              attributes={descriptionItems.slice(0, maxDescriptionItems)}
            />
            {descriptionItems.length > maxDescriptionItems && (
              <ShowMore>
                <ProductAttributes
                  className="mt-1 grid gap-1"
                  attributes={descriptionItems.slice(maxDescriptionItems)}
                />
              </ShowMore>
            )}
          </>
        )}
      </div>

      <div
        className={classnames(
          'mt-4 flex flex-col justify-start',
          isDiscounted ? 'gap-[52px] lg:gap-6' : 'gap-[72px] lg:gap-8',
          {
            'md:mt-0 md:shrink-0 md:self-stretch md:text-end': variant === 'list-item',
          },
        )}
      >
        <div className={classnames('hidden justify-end', { 'md:flex': variant === 'list-item' })}>
          {price ? (
            <StockIndicator inStock={inStock} restockableInDays={restockableInDays} />
          ) : (
            <span className="text-red-500">{translate('common.not-available')}</span>
          )}
        </div>

        <div
          className={classnames('flex flex-col', {
            'gap-3 md:items-end': variant === 'list-item',
            'gap-4 md:gap-5 lg:gap-6': variant === 'grid-item',
          })}
        >
          <div className={classnames('hidden', { 'lg:block': variant === 'list-item' })}>
            <QuantityWidget
              value={quantity}
              onChange={setQuantity}
              minValue={1}
              maxValue={maxQuantity}
              disabled={!hasPriceAndIsInStock || addToCartDisabled}
            />
          </div>

          <div className={!price ? 'invisible' : ''}>
            {isDiscounted ? (
              <div
                className={classnames('flex items-center gap-3', {
                  'md:flex-col-reverse md:items-end md:gap-2': variant === 'list-item',
                })}
              >
                <span
                  className={classnames(
                    'font-bold leading-loose text-red-500',
                    variant === 'list-item' ? 'text-18' : 'text-20',
                  )}
                >
                  {formatCurrency(discountedPrice as number, currency)}
                </span>
                <span className="text-14 leading-tight text-gray-600 line-through">
                  {formatCurrency(price, currency)}
                </span>
              </div>
            ) : (
              <span
                className={classnames(
                  'font-semibold leading-tight text-gray-800',
                  variant === 'list-item' ? 'text-18' : 'text-20',
                )}
              >
                {formatCurrency(price, currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className={classnames('hidden', { 'lg:block': variant === 'grid-item' })}>
              <QuantityWidget
                value={quantity}
                onChange={setQuantity}
                minValue={Math.min(1, maxQuantity ?? Infinity)}
                maxValue={maxQuantity}
                showLabel={false}
                disabled={!hasPriceAndIsInStock || addToCartDisabled}
              />
            </div>

            <Button
              variant="secondary"
              size="m"
              className="grow truncate"
              onClick={handleAddToCart}
              loading={addingToCart}
              disabled={!hasPriceAndIsInStock || addToCartDisabled || maxQuantity === 0}
            >
              {translate('cart.add')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTile;

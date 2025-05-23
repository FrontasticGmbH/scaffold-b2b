import React from 'react';
import Image from '@/components/atoms/Image';
import QuantityWidget from '@/components/atoms/quantity-widget';
import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';
import { ArrowUturnLeftIcon as UndoIcon } from '@heroicons/react/24/outline';
import Button from '@/components/atoms/button';
import useFormat from '@/hooks/useFormat';
import CartItemHeader from './cart-item-header';
import CartItemFooter from './cart-item-footer';
import { CartItemProps } from '../types';

const CartItem = ({ item, onUpdateQuantity, onRemove, onUndoRemove, onAddToNewWishlist }: CartItemProps) => {
  const { formatCurrency } = useFormat();

  const translate = useTranslations();

  if (item.deleted)
    return (
      <div className="flex flex-col items-center px-4 py-8">
        <p className="pb-8 text-center text-gray-600">
          <Link href={item.url ?? '#'} className="inline text-primary underline">
            {item.name}
          </Link>{' '}
          {translate('cart.item-was-removed')}
        </p>
        <Button variant="secondary" size="m" Icon={UndoIcon} onClick={onUndoRemove}>
          {translate('common.undo')}
        </Button>
      </div>
    );

  return (
    <div className="pt-5 md:py-8 lg:gap-12">
      <CartItemHeader className="md:hidden" item={item} />

      <div className="mt-10 flex max-w-full items-stretch justify-start md:mt-0 md:gap-10">
        <Link href={item.url ?? '#'}>
          <div className="md:size-[124px] lg:size-[132px]">
            <Image
              className="size-full"
              src={item.images?.[0]}
              style={{ objectFit: 'contain' }}
              width={108}
              height={108}
              suffix="small"
              alt="product image"
            />
          </div>
        </Link>
        <div className="flex w-full justify-center md:items-end md:justify-between md:gap-6 lg:gap-12">
          <div>
            <CartItemHeader className="hidden md:block" item={item} />

            <CartItemFooter
              className="hidden md:flex"
              onRemove={onRemove}
              item={item}
              onAddToNewWishlist={onAddToNewWishlist}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
            {item.quantity && item.quantity > 1 && (
              <p className="text-12 leading-loose text-gray-600">
                {`${formatCurrency(item.discountedPrice ?? item.price ?? 0, item.currency)}/ea`}
              </p>
            )}

            <QuantityWidget
              showLabel={false}
              defaultValue={1}
              value={item.quantity}
              minValue={Math.min(1, item.maxQuantity ?? Infinity)}
              maxValue={item.maxQuantity}
              onChange={onUpdateQuantity}
            />

            <div>
              {item.discountedPrice ? (
                <div className="relative">
                  <p className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-14 font-normal leading-tight text-gray-600 line-through">
                    {formatCurrency((item.price ?? 0) * (item.quantity ?? 1), item.currency)}
                  </p>
                  <p className="text-center text-16 font-semibold leading-loose text-red-500 md:text-18">
                    {formatCurrency(item.discountedPrice * (item.quantity ?? 1), item.currency)}
                  </p>
                </div>
              ) : (
                <p className="text-center text-16 font-semibold leading-loose text-gray-700 md:text-18">
                  {formatCurrency((item.price ?? 0) * (item.quantity ?? 1), item.currency)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartItemFooter
        onAddToNewWishlist={onAddToNewWishlist}
        className="justify-between md:hidden"
        onRemove={onRemove}
        item={item}
      />
    </div>
  );
};

export default CartItem;

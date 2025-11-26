import React from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';
import useFormat from '@/hooks/useFormat';
import { GiftIcon } from '@heroicons/react/24/solid';
import CartItemFooter from './cart-item-footer';
import { CartItemProps } from '../types';
import CartItemHeader from './cart-item-header';

type CartGiftItemProps = Pick<CartItemProps, 'item'> & {
  discountName?: string;
  onRemove?: () => Promise<void>;
};

const CartGiftItem = ({ item, discountName, onRemove }: CartGiftItemProps) => {
  const { formatCurrency } = useFormat();

  const translate = useTranslations();

  return (
    <div className="relative rounded-sm border border-green-600 bg-green-100 p-5 md:p-6">
      <div className="flex max-w-full items-stretch justify-start gap-3 sm:gap-6 lg:gap-12">
        <Link href={item.url ?? '#'} className="h-fit">
          <div className="relative size-[88px] md:size-[140px] md:shrink-0">
            <Image src={item.images?.[0]} style={{ objectFit: 'cover' }} fill suffix="small" alt={item.name} />
          </div>
        </Link>

        <div className="flex flex-col gap-1">
          {discountName && (
            <div className="flex w-fit items-center gap-1 rounded-md border border-green-600 bg-green-100 px-2 py-1">
              <GiftIcon className="size-4 text-green-700" />
              <p className="text-12 font-semibold text-green-700">{discountName}</p>
            </div>
          )}
          <CartItemHeader item={item} showStockAvailability={false} />
          <CartItemFooter onRemove={onRemove} item={item} showRemoveOnly={true} className="mt-4 hidden md:flex" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1">
        <p className="text-14 leading-loose text-gray-400 line-through">
          {formatCurrency(item.price * (item.quantity ?? 1), item.currency)}
        </p>
        <p className="text-16 font-bold capitalize leading-loose text-green-500">{translate('common.free')}</p>
      </div>
      <CartItemFooter onRemove={onRemove} item={item} className="mt-5 justify-center md:hidden" />
    </div>
  );
};

export default CartGiftItem;

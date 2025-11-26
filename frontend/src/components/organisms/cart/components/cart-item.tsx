import React from 'react';
import Image from '@/components/atoms/Image';
import QuantityWidget from '@/components/atoms/quantity-widget';
import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';
import { ArrowUturnLeftIcon as UndoIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon as DiscountInfoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '@/components/atoms/button';
import useFormat from '@/hooks/useFormat';
import { Tooltip } from 'react-tooltip';
import CartItemHeader from './cart-item-header';
import CartItemFooter from './cart-item-footer';
import { CartItemProps } from '../types';

const CartItem = ({
  item,
  discountCodesApplied,
  onUpdateQuantity,
  onRemove,
  onUndoRemove,
  onAddToNewWishlist,
  onClearItem,
}: CartItemProps) => {
  const { formatCurrency } = useFormat();

  const translate = useTranslations();

  if (item.deleted) {
    return (
      <div className="relative">
        <button className="absolute right-0 top-1.5 block" onClick={() => onClearItem?.(item.id)}>
          <XMarkIcon className="size-5 shrink-0 text-gray-600" />
        </button>

        <div className="flex flex-col items-center px-4 py-8">
          <p className="mb-4 text-center text-gray-600">
            <Link href={item.url ?? '#'} className="inline text-primary underline">
              {item.name}
            </Link>
            {` ${translate('cart.item-was-removed')}.`}
          </p>
          <Button variant="secondary" size="s" Icon={UndoIcon} onClick={onUndoRemove}>
            {translate('common.undo')}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-sm border border-neutral-400">
      <div className="flex max-w-full items-stretch justify-start gap-3 p-5 sm:gap-6 md:p-6 lg:gap-12">
        <Link href={item.url ?? '#'} className="h-fit">
          <div className="relative size-[88px] md:size-[140px] md:shrink-0">
            <Image src={item.images?.[0]} style={{ objectFit: 'cover' }} fill suffix="small" alt={item.name} />
          </div>
        </Link>

        <div className="flex flex-col items-start gap-3 md:grow md:flex-row md:items-stretch md:justify-between md:gap-5">
          <div className="flex flex-col items-start justify-between">
            <CartItemHeader item={item} />
            <CartItemFooter
              onAddToNewWishlist={onAddToNewWishlist}
              onRemove={onRemove}
              item={item}
              className="hidden md:flex"
            />
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end md:self-end lg:gap-3">
            {item.quantity && item.quantity > 1 && (
              <p className="text-12 leading-loose text-gray-600">
                {`${formatCurrency(item.price ?? 0, item.currency)}/ea`}
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
                <div className="flex flex-col gap-2 md:items-end md:gap-1">
                  <div className="relative flex flex-col items-start gap-1 md:flex-row md:items-center">
                    <p className="text-center text-16 font-semibold leading-loose text-green-500 md:order-2 md:text-18">
                      {formatCurrency(item.discountedPrice * (item.quantity ?? 1), item.currency)}
                    </p>
                    <p className="text-14 font-normal leading-tight text-gray-400 line-through">
                      {formatCurrency((item.price ?? 0) * (item.quantity ?? 1), item.currency)}
                    </p>
                  </div>
                  {item.discount && (
                    <div className="flex items-start gap-1 md:flex-row-reverse">
                      <span
                        data-tooltip-id={`${item.id}-discount-toolip`}
                        data-tooltip-content={item.discount?.description}
                      >
                        <DiscountInfoIcon className="size-[20px] text-green-500" />
                      </span>
                      <Tooltip
                        place="left"
                        id={`${item.id}-discount-toolip`}
                        className="max-w-[160px] rounded-md bg-gray-700 text-white md:max-w-[325px]"
                      />
                      <p className="text-12 text-green-500">{item.discount?.name}</p>
                    </div>
                  )}
                  {discountCodesApplied && discountCodesApplied.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {(discountCodesApplied || []).map((dc) => (
                        <div className="rounded-md bg-blue-100 p-2" key={`${dc.code}-${dc.name}`}>
                          <p className="text-12 font-semibold text-gray-600">
                            {dc.name}
                            {dc.code && (
                              <span className="text-gray-700">
                                {', '}
                                {translate('cart.code-applied')}: {dc.code}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
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
        onRemove={onRemove}
        item={item}
        className="mt-5 justify-center md:hidden"
      />
    </div>
  );
};

export default CartItem;

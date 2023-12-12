import React from 'react';
import { useParams } from 'next/navigation';
import Image from '@/components/atoms/Image';
import Typography from '@/components/atoms/typography';
import QuantityWidget from '@/components/atoms/quantity-widget';
import { CurrencyHelpers } from '@/utils/currency-helpers';
import CartItemHeader from './cart-item-header';
import CartItemFooter from './cart-item-footer';
import { CartItemProps } from '../types';

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { locale } = useParams();

  return (
    <div className="pt-5 md:py-8 lg:gap-12">
      <CartItemHeader className="md:hidden" item={item} />

      <div className="mt-10 flex max-w-full items-stretch justify-start md:mt-0 md:gap-10">
        <Image
          className="md:h-[124px] md:w-[124px] lg:h-[132px] lg:w-[132px]"
          src={item.variant?.images?.[0]}
          style={{ objectFit: 'contain' }}
          width={108}
          height={108}
          suffix="small"
          alt="product image"
        />
        <div className="flex w-full justify-between md:items-end">
          <div>
            <CartItemHeader className="hidden md:block" item={item} />

            <CartItemFooter className="hidden md:flex" onRemove={onRemove} />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
            {(item.count ?? 0) > 1 && (
              <Typography lineHeight="loose" fontSize={12} className="text-gray-600">
                {`${CurrencyHelpers.formatForCurrency(item.discountedPrice ?? item.price ?? 0, locale)}/ea`}
              </Typography>
            )}

            <QuantityWidget showLabel={false} defaultValue={1} value={item.count} onChange={onUpdateQuantity} />

            <div className="flex items-center gap-1 md:gap-2">
              {item.discountedPrice ? (
                <div className="flex items-center gap-1">
                  <Typography lineHeight="tight" fontSize={14} className="font-normal text-gray-600 line-through">
                    {CurrencyHelpers.formatForCurrency((item.price?.centAmount ?? 0) * (item.count ?? 1), locale)}
                  </Typography>
                  <Typography
                    lineHeight="loose"
                    fontSize={16}
                    fontWeight="semibold"
                    className="text-red-500 md:text-18"
                  >
                    {CurrencyHelpers.formatForCurrency(item.totalPrice ?? 0, locale)}
                  </Typography>
                </div>
              ) : (
                <Typography lineHeight="loose" fontSize={16} fontWeight="semibold" className="text-gray-700 md:text-18">
                  {CurrencyHelpers.formatForCurrency(item.totalPrice ?? 0, locale)}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartItemFooter className="justify-between px-4 md:hidden" onRemove={onRemove} />
    </div>
  );
};

export default CartItem;

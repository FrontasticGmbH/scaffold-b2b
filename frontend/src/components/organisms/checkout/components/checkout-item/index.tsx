import { useCallback } from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import useFormat from '@/hooks/useFormat';
import { Product } from '@/types/entity/product';
import { InformationCircleIcon as DiscountInfoIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

const CheckoutItem = ({ product }: { product: Product }) => {
  const { url, images, name, price, discountedPrice, currency, quantity, discountCode, discountPercentage, discount } =
    product;

  const { formatCurrency } = useFormat();

  const translate = useTranslations();

  const renderPriceInfo = useCallback(
    ({ className }: { className?: string }) => {
      return (
        <div className={className}>
          {discountedPrice ? (
            <div className="flex flex-col gap-2 md:items-end md:gap-1 lg:items-start lg:gap-2">
              <div className="relative flex flex-col items-start gap-1 md:flex-row md:items-center lg:flex-col lg:items-start">
                <p className="text-center text-16 font-semibold leading-loose text-green-500 md:order-2 md:text-18 lg:order-none">
                  {formatCurrency(discountedPrice, currency)}
                </p>
                <p className="text-14 font-normal leading-tight text-gray-400 line-through">
                  {formatCurrency(price ?? 0, currency)}
                </p>
              </div>
              {!discountCode ? (
                <div className="flex items-start gap-1">
                  <DiscountInfoIcon className="size-[20px] text-green-500" />
                  <p className="text-12 text-green-500">{discount?.name}</p>
                </div>
              ) : (
                <div className="rounded-md bg-blue-100 p-2">
                  <p className="text-12 font-semibold text-gray-600">
                    {discountCode.name} {translate('cart.code-applied')}:{' '}
                    <span className="text-gray-700">{discountCode.code}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-start text-16 leading-loose text-gray-600">{formatCurrency(price ?? 0, currency)}</p>
          )}
        </div>
      );
    },
    [translate, formatCurrency, price, discountedPrice, currency, discountCode, discountPercentage, discount],
  );

  return (
    <div className="flex items-center gap-4 border-t border-neutral-400 py-4 md:gap-8">
      <div className="relative size-[88px] shrink-0">
        <Link href={url ?? '#'}>
          <Image src={images?.[0]} fill style={{ objectFit: 'contain' }} alt={name} />
        </Link>
      </div>
      <div className="flex grow flex-col overflow-hidden md:flex-row md:items-center md:justify-between lg:flex-col lg:items-start lg:justify-start">
        <div>
          <Link href={url ?? '#'} className="text-14 font-semibold leading-loose text-gray-800 md:text-16">
            {name}
          </Link>

          {renderPriceInfo({ className: 'mt-2 md:hidden lg:block' })}

          <span className="mt-2 block text-14 text-gray-400">x {quantity}</span>
        </div>

        {renderPriceInfo({ className: 'hidden md:block lg:hidden' })}
      </div>
    </div>
  );
};

export default CheckoutItem;

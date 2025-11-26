import React from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';
import useFormat from '@/hooks/useFormat';
import { Product } from '@/types/entity/product';

const CheckoutGiftItem = ({ product }: { product: Product }) => {
  const { formatCurrency } = useFormat();

  const translate = useTranslations();

  return (
    <div className="flex items-center gap-3 border border-green-600 bg-green-100 p-4">
      <Link href={product.url ?? '#'} className="h-fit shrink-0">
        <div className="relative size-[88px]">
          <Image src={product.images?.[0]} style={{ objectFit: 'cover' }} fill suffix="small" alt={product.name} />
        </div>
      </Link>

      <div className="grow items-center justify-between md:flex lg:block">
        <Link href={product.url ?? '#'} className="text-14 font-semibold leading-loose text-gray-800 md:text-16">
          {product.name}
        </Link>

        <div className="mt-4 flex flex-col items-start gap-1">
          <p className="text-16 font-bold capitalize leading-loose text-green-500">{translate('common.free')}</p>
          <p className="text-14 leading-loose text-gray-400 line-through">
            {formatCurrency(product.price * (product.quantity ?? 1), product.currency)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutGiftItem;

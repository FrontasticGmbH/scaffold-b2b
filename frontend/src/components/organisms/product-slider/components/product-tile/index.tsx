import React, { useCallback, useState } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { Product } from '@/types/entity/product';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/button';
import { useTranslations } from 'use-intl';
import useFormat from '@/hooks/useFormat';
import Link from '@/components/atoms/link';

const ProductTile = ({
  product,
  addToCartDisabled = false,
  onAddToCart,
}: {
  product: Product;
  addToCartDisabled?: boolean;
  onAddToCart?: () => Promise<void>;
}) => {
  const translate = useTranslations();

  const [isLoading, setIsLoading] = useState(false);

  const { formatCurrency } = useFormat();

  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);

    await onAddToCart?.();

    setIsLoading(false);
  }, [onAddToCart]);

  const displayPrice = useCallback(() => {
    if (product.discountedPrice)
      return (
        <div className="flex items-center gap-2">
          <span className="text-12 font-bold leading-loose text-gray-800 md:text-14 lg:text-16">
            {formatCurrency(product.discountedPrice, product.currency)}
          </span>
          <span className="text-12 leading-loose text-gray-600 line-through lg:text-14">
            {formatCurrency(product.price, product.currency)}
          </span>
        </div>
      );

    if (product.priceRange)
      return (
        <div className="flex">
          <span className="text-12 font-bold leading-loose text-gray-800 md:text-14 lg:text-16">
            {formatCurrency(product.priceRange[0], product.currency)} -{' '}
            {formatCurrency(product.priceRange[1], product.currency)}
          </span>
        </div>
      );

    return (
      <div className="flex">
        <span
          className={classnames('text-12 font-bold leading-loose md:text-14 lg:text-16', {
            'text-red-500': !product.price,
            'text-gray-800': !!product.price,
          })}
        >
          {product.price ? formatCurrency(product.price, product.currency) : translate('common.not-available')}
        </span>
      </div>
    );
  }, [product.price, product.discountedPrice, product.priceRange, product.currency, formatCurrency]);

  return (
    <div className="py-1">
      <Link href={product.url ?? '#'}>
        <div className="rounded-sm bg-white p-4 md:p-5 lg:p-6">
          <div className="relative pb-[70%]">
            <Image src={product.images?.[0]} suffix="medium" alt={product.name} style={{ objectFit: 'contain' }} fill />
          </div>
        </div>
      </Link>
      <div className="p-2">
        <span className="text-12 leading-loose text-gray-600">{product.sku}</span>
        <Link
          href={product.url ?? '#'}
          className="line-clamp-2 h-[42px] text-14 font-semibold leading-loose text-gray-800 md:mt-1 lg:h-[48px] lg:text-16"
        >
          {product.name}
        </Link>
        <div className="mt-2 md:mt-3 lg:mt-8">{displayPrice()}</div>
      </div>
      {!addToCartDisabled && (
        <div className="pt-1">
          <Button
            loading={isLoading}
            variant="secondary"
            size="s"
            className="w-full px-1 text-12 md:text-14 lg:py-3"
            onClick={() => {
              if (!product.price) return;
              handleAddToCart();
            }}
            disabled={!product.price}
          >
            {translate('cart.add')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductTile;

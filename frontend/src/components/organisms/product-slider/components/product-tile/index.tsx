import React, { useCallback, useState } from 'react';
import { Product } from '@/types/entity/product';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/button';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useFormat from '@/hooks/useFormat';
import Link from '@/components/atoms/link';

const ProductTile = ({ product, onAddToCart }: { product: Product; onAddToCart?: () => Promise<void> }) => {
  const { translate } = useTranslation();

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
        <span className="text-12 font-bold leading-loose text-gray-800 md:text-14 lg:text-16">
          {formatCurrency(product.price, product.currency)}
        </span>
      </div>
    );
  }, [product.price, product.discountedPrice, product.priceRange, product.currency, formatCurrency]);

  return (
    <div className="py-1">
      <Link href={product.url ?? '#'}>
        <div className="rounded-sm bg-white p-4 md:p-5 lg:p-6">
          <div className="relative pb-[70%]">
            <Image src={product.images?.[0]} alt={product.name} style={{ objectFit: 'contain' }} fill />
          </div>
        </div>
      </Link>
      <div className="p-2">
        <span className="text-12 leading-loose text-neutral-900">{product.model}</span>
        <Link
          href={product.url ?? '#'}
          className="line-clamp-2 h-[42px] text-14 font-semibold leading-loose text-gray-800 md:mt-1 lg:h-[48px] lg:text-16"
        >
          {product.name}
        </Link>
        <div className="mt-2 md:mt-3 lg:mt-8">{displayPrice()}</div>
      </div>
      <div className="pt-1">
        <Button
          loading={isLoading}
          variant="secondary"
          size="s"
          className="w-full px-1 text-12 md:text-14 lg:py-3"
          onClick={handleAddToCart}
        >
          {translate('cart.add')}
        </Button>
      </div>
    </div>
  );
};

export default ProductTile;

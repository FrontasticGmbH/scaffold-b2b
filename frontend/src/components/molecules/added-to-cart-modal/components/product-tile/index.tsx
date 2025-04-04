import React from 'react';
import Image from '@/components/atoms/Image';
import useFormat from '@/hooks/useFormat';
import Link from '@/components/atoms/link';
import { ProductTileProps } from '@/components/molecules/added-to-cart-modal/types';

const ProductTile = ({ product }: ProductTileProps) => {
  const { formatCurrency } = useFormat();

  return (
    <div>
      <Link href={product.url ?? '#'}>
        <div className="rounded-sm bg-white p-4 md:p-5 lg:p-6">
          <div className="relative pb-[70%]">
            <Image src={product.images?.[0]} alt={product.name} style={{ objectFit: 'contain' }} fill />
          </div>
        </div>
      </Link>
      <div className="p-2">
        <span className="line-clamp-1 text-12 leading-loose text-gray-600">{product.sku}</span>
        <Link
          href={product.url ?? '#'}
          className="line-clamp-2 h-[42px] text-14 font-semibold leading-loose text-gray-800 md:mt-1 lg:h-[48px] lg:text-16"
        >
          {product.name}
        </Link>
        <div className="mt-2">
          <div className="flex">
            <p className="text-12 font-bold leading-loose text-gray-800 md:text-14 lg:text-16">
              {formatCurrency(product.price, product.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTile;

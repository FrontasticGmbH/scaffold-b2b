import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import ProductTile from '@/components/molecules/product-tile';
import { useAddToCartOverlay } from '@/providers/add-to-cart-overlay';
import { Product } from '@/types/entity/product';
import { useProductList } from '../../context';
import { ProductListProps } from '../../types';

const List = ({ onAddToCart }: ProductListProps) => {
  const { products, view } = useProductList();
  const { showModal } = useAddToCartOverlay();
  const handleOnAddToCart = async (product: Product, qty: number) => {
    await onAddToCart(product.sku as string, qty);
    showModal(product);
  };
  return (
    <div className={classnames('grid grid-cols-1 gap-[1px]', { 'md:grid-cols-2 xl:grid-cols-3': view === 'grid' })}>
      {products.map((product) => (
        <div key={product.id} className="outline outline-1 outline-neutral-400">
          <ProductTile
            item={product}
            variant={view === 'grid' ? 'grid-item' : 'list-item'}
            className="border-none"
            onAddToCart={(qty) => handleOnAddToCart(product, qty)}
          />
        </div>
      ))}
    </div>
  );
};

export default List;

import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import ProductTile from '@/components/molecules/product-tile';
import { useProductList } from '../../context';
import { ProductListProps } from '../../types';

const List = ({ onAddToCart }: ProductListProps) => {
  const { products, view } = useProductList();

  return (
    <div className={classnames('grid grid-cols-1 gap-[1px]', { 'md:grid-cols-2 xl:grid-cols-3': view === 'grid' })}>
      {products.map((product) => (
        <div key={product.id} className="outline outline-1 outline-neutral-400">
          <ProductTile
            item={product}
            variant={view === 'grid' ? 'grid-item' : 'list-item'}
            className="border-none"
            onAddToCart={(qty) => onAddToCart(product.sku as string, qty)}
          />
        </div>
      ))}
    </div>
  );
};

export default List;

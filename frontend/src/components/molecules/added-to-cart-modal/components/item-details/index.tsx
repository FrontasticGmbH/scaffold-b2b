import React from 'react';
import Image from '@/components/atoms/Image';
import { Product } from '@/types/entity/product';

type PropsType = {
  item: Product;
};
const ItemDetails = ({ item }: PropsType) => {
  return (
    <>
      {item.images && (
        <Image className="row-start-2 w-full pr-10 md:row-span-2 md:pr-0" src={item.images[0]} alt={item.name} />
      )}
      <div className="col-span-2 row-start-1 mb-6 md:col-span-5 md:col-start-2 md:row-start-1 md:mb-0 md:pl-6">
        <p className="mb-2 truncate text-sm font-semibold leading-tight text-gray-700 md:text-base md:leading-none">
          {item.name}
        </p>
        {item.sku && (
          <p className="truncate text-14 leading-tight text-gray-600 md:mb-4 md:text-sm md:leading-none">{item.sku}</p>
        )}
      </div>
    </>
  );
};

export default ItemDetails;

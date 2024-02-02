import React from 'react';
import Typography from '@/components/atoms/typography';
import Image from '@/components/atoms/Image';
import { Product } from '@/types/entity/product';

type PropsType = {
  item: Product;
};
const ItemDetails = ({ item }: PropsType) => {
  return (
    <>
      {item.images && <Image className="row-start-2 w-full pr-10 md:row-span-2 md:pr-0" src={item.images[0]} alt="" />}
      <div className="col-span-2 row-start-1 mb-6 md:col-span-5 md:col-start-2 md:row-start-1 md:mb-0 md:pl-6">
        <Typography
          lineHeight="tight"
          fontWeight="semibold"
          className="mb-2 truncate text-sm leading-none text-gray-700 md:text-base md:leading-none"
        >
          {item.name}
        </Typography>
        {item.model && (
          <Typography
            fontSize={14}
            lineHeight={'tight'}
            className="truncate text-xs leading-none text-gray-600 md:mb-4 md:text-sm md:leading-none"
          >
            {item.model}
          </Typography>
        )}
      </div>
    </>
  );
};

export default ItemDetails;

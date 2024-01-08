import React from 'react';
import Typography from '@/components/atoms/typography';
import Link from '@/components/atoms/link';
import Image from '@/components/atoms/Image';
import { ProductSuggestion } from '../../types';

const SearchPanelItemsLarge = ({ sku, url, image, name }: ProductSuggestion) => {
  return (
    <div className="px-4 pb-2 md:px-6">
      <Link href={url ?? sku}>
        <div className="flex items-center justify-start gap-x-5">
          {image && (
            <div className="relative h-[48px] w-[48px]">
              <Image fill src={image} alt={name} style={{ objectFit: 'contain' }} />
            </div>
          )}
          <Typography fontSize={16} className="w-full truncate">
            {name}
          </Typography>
        </div>
      </Link>
    </div>
  );
};
export default SearchPanelItemsLarge;

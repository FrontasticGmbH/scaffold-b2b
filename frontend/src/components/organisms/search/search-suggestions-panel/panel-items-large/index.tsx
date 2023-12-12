import React from 'react';
import Typography from '@/components/atoms/typography';
import Link from '@/components/atoms/link';
import Image from '@/components/atoms/Image';
import { Suggestion } from '../../types';

const SearchPanelItemsLarge = ({ sku, url, image, name }: Suggestion) => {
  return (
    <div className="px-6 pb-2">
      <Link href={url ?? sku}>
        <div className="flex items-center justify-start gap-x-5">
          {image && <Image src={image.src} width={image.width} height={image.height} alt="Img" />}
          <Typography fontSize={16} className="w-full truncate">
            {name}
          </Typography>
        </div>
      </Link>
    </div>
  );
};
export default SearchPanelItemsLarge;

'use client';

import React from 'react';
import Image from '@/components/atoms/Image';
import { ArrowLongRightIcon as ArrowIcon } from '@heroicons/react/24/solid';
import Link from '@/components/atoms/link';
import { ContentTileProps } from './types';

const ContentTile = ({ title, link, image, imageSizes }: ContentTileProps) => {
  return (
    <div>
      <Link href={link?.href ?? '#'} openInNewTab={link?.openInNewTab} className="relative block w-full pb-[85%]">
        <Image
          {...image}
          fill
          style={{ objectFit: 'cover' }}
          sizes={imageSizes}
          alt={title ?? ''}
          className="rounded-md"
        />
      </Link>
      <Link
        href={link?.href ?? '#'}
        openInNewTab={link?.openInNewTab}
        underlineOnHover={false}
        className="mt-4 block py-1 text-16 font-bold leading-normal text-gray-700 lg:text-18"
      >
        {title}
      </Link>
      <Link
        href={link?.href ?? '#'}
        openInNewTab={link?.openInNewTab}
        className="mt-3 flex items-center gap-2 py-1 text-14 leading-normal text-gray-700 lg:text-16"
      >
        <span className="hidden lg:block">{link?.name}</span>
        <ArrowIcon className="text-gray-700" width={20} />
      </Link>
    </div>
  );
};

export default ContentTile;

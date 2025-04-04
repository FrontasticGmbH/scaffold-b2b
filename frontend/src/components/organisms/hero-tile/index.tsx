import React from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import { ArrowLongRightIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { HeroTileProps } from './types';

const HeroTile = ({ image, title, links, isPriority, imageQuality }: HeroTileProps) => {
  return (
    <div className="relative w-full pb-[75%] md:pb-[56%] lg:pb-[42%]">
      {image && (
        <Image
          {...image}
          alt={title ?? ''}
          fill
          style={{ objectFit: 'cover' }}
          priority={isPriority}
          fetchPriority={isPriority ? 'high' : 'auto'}
          quality={imageQuality}
        />
      )}
      <div className="absolute left-0 top-0 size-full bg-black/30">
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-12 lg:left-12">
          <h1 className="text-22 font-extrabold leading-loose text-white md:text-28 lg:text-40">{title}</h1>
          {links && links.length > 0 && (
            <div className="mt-2 flex w-fit flex-col gap-6 bg-white py-4 pl-3 pr-6 md:mt-5 md:flex-row md:gap-11 md:px-6 md:py-7 lg:gap-16 lg:px-9">
              {links.map(({ name, href, openInNewTab }, index) => (
                <Link
                  key={index}
                  href={href ?? '#'}
                  openInNewTab={openInNewTab}
                  className="flex items-center gap-2 text-14 font-extrabold text-gray-800 md:text-18 lg:text-20"
                >
                  {name} <ArrowIcon width={20} className="text-gray-800" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroTile;

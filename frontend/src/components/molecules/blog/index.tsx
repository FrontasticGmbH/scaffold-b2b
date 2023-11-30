import React from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import Markdown from '@/components/atoms/markdown';
import { BlogProps } from './types';

const Blog = ({ image, title, description, link }: BlogProps) => {
  return (
    <div>
      {image && (
        <div className="relative w-full overflow-hidden rounded-sm pb-[63%] xl:pb-[41%]">
          <Image {...image} alt={title ?? ''} fill style={{ objectFit: 'cover' }} />
        </div>
      )}
      {title && (
        <h5 className="pt-3 text-16 font-semibold uppercase leading-loose text-gray-700 md:text-18 lg:text-20">
          {title}
        </h5>
      )}
      {description && (
        <Markdown className="pt-2 text-14 leading-loose text-gray-600 md:pt-3 md:text-16">{description}</Markdown>
      )}
      {link.name && (
        <Link
          className="pt-5 text-14 text-gray-700 underline underline-offset-2 md:text-16"
          href={link.href ?? '#'}
          openInNewTab={link.openInNewTab}
        >
          {link.name}
        </Link>
      )}
    </div>
  );
};

export default Blog;

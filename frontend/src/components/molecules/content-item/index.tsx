'use client';

import React from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import { ContentItemProps } from './types';
import useClassNames from './hooks/useClassNames';

const ContentItem = ({ image, imageSizes, title, variant = 'default', link }: ContentItemProps) => {
  const { containerClassName, imageClassName, titleClassName } = useClassNames(variant);

  return (
    <Link
      href={link?.href ?? '#'}
      openInNewTab={link?.openInNewTab}
      className={containerClassName}
      underlineOnHover={false}
    >
      <div className={imageClassName}>
        <Image {...image} fill sizes={imageSizes} style={{ objectFit: 'contain' }} alt={title ?? ''} />
      </div>
      <span data-testid="title-text" className={titleClassName}>
        {title}
      </span>
    </Link>
  );
};

export default ContentItem;

'use client';

import React from 'react';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import { ContentItemProps } from './types';
import useClassNames from './hooks/useClassNames';

const ContentItem = ({ image, title, variant = 'default', link }: ContentItemProps) => {
  const { containerClassName, imageClassName, titleClassName } = useClassNames(variant);

  return (
    <Link
      href={link?.href ?? '#'}
      openInNewTab={link?.openInNewTab}
      className={containerClassName}
      underlineOnHover={false}
    >
      <div className={imageClassName}>
        <Image {...image} fill style={{ objectFit: 'contain' }} alt={title ?? ''} />
      </div>
      <h5 className={titleClassName}>{title}</h5>
    </Link>
  );
};

export default ContentItem;

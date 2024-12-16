'use client';

import React from 'react';
import SectionHeader from '@/components/molecules/section-header';
import ContentItem from '@/components/molecules/content-item';
import useImageSizes from '@/hooks/useImageSizes';
import { ContentItemsProps } from './types';
import useClassNames from './hooks/useClassNames';

const ContentItems = ({ title, link, items, variant = 'default' }: ContentItemsProps) => {
  const { containerClassName, listClassName } = useClassNames(variant);

  const imageSizes = useImageSizes({ sm: 0.5, md: 0.33, lg: 0.15, defaultSize: 0.1 });

  return (
    <div className={containerClassName}>
      <SectionHeader title={title} link={link} />

      <div className={listClassName}>
        {items.map((item, index) => (
          <ContentItem key={index} {...item} variant={variant} imageSizes={imageSizes} />
        ))}
      </div>
    </div>
  );
};

export default ContentItems;

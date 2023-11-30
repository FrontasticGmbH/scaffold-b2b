'use client';

import React from 'react';
import SectionHeader from '@/components/molecules/section-header';
import ContentItem from '@/components/molecules/content-item';
import { ContentItemsProps } from './types';
import useClassNames from './hooks/useClassNames';

const ContentItems = ({ title, link, items, variant = 'default' }: ContentItemsProps) => {
  const { containerClassName, listClassName } = useClassNames(variant);

  return (
    <div className={containerClassName}>
      <SectionHeader title={title} link={link} />

      <div className={listClassName}>
        {items.map((item, index) => (
          <ContentItem key={index} {...item} variant={variant} />
        ))}
      </div>
    </div>
  );
};

export default ContentItems;

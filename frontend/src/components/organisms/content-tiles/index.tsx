'use client';

import React from 'react';
import ContentTile from '@/components/molecules/content-tile';
import SectionHeader from '@/components/molecules/section-header';
import { ContentTilesProps } from './types';

const ContentTiles = ({ title, link, items }: ContentTilesProps) => {
  return (
    <div className="bg-neutral-200 px-4 pb-9 md:px-5 md:pb-12 lg:px-12 lg:pb-16">
      <SectionHeader title={title} link={link} />

      <div className="flex w-full justify-stretch gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex-1">
            <ContentTile {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentTiles;

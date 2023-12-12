'use client';

import React from 'react';
import SectionHeader from '@/components/molecules/section-header';
import ContentTile from '@/components/molecules/content-tile';
import { ContentSliderProps } from './types';
import Slider from '../slider';

const ContentSlider = ({ title, link, items }: ContentSliderProps) => {
  return (
    <div className="bg-neutral-200 px-[10px] pb-9 md:px-[11px] md:pb-12 lg:px-[36px] lg:pb-16">
      <SectionHeader title={title} link={link} />

      <Slider
        dots
        spaceBetween={{ base: 12, md: 18, lg: 24 }}
        slidesToShow={{ base: 1, md: 2, lg: 3 }}
        arrows
        arrowVariant="overlay"
        arrowStyles={{ top: '40%' }}
      >
        {items.map((item, index) => (
          <ContentTile key={index} {...item} />
        ))}
        {items.map((item, index) => (
          <ContentTile key={index * 10} {...item} />
        ))}
      </Slider>
    </div>
  );
};

export default ContentSlider;

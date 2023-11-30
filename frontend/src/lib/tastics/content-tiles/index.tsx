import React from 'react';
import ContentSlider from '@/components/organisms/content-slider';
import ContentTiles from '@/components/organisms/content-tiles';
import { ContentTilesProps } from '@/components/organisms/content-tiles/types';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { TasticProps } from '../types';
import { Props } from './types';

const ContentTilesTastic = ({ data: { asSlider, ...baseData } }: TasticProps<Props>) => {
  const data = {
    ...baseData,
    link: resolveReference(baseData.linkReference, baseData.link),
    items: baseData.items.map((item) => ({ ...item, link: resolveReference(item.linkReference, item.link) })),
  } as ContentTilesProps;

  return asSlider ? <ContentSlider {...data} /> : <ContentTiles {...data} />;
};

export default ContentTilesTastic;

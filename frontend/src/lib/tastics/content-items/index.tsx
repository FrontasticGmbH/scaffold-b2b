import React from 'react';
import ContentItems from '@/components/organisms/content-items';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { TasticProps } from '../types';
import { Props } from './types';

const ContentItemsTastic = ({ data }: TasticProps<Props>) => {
  return (
    <ContentItems
      {...data}
      items={data.items.map((item) => ({ ...item, link: resolveReference(item.link) }))}
      link={resolveReference(data.linkReference, data.link)}
    />
  );
};

export default ContentItemsTastic;

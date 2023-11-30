import React from 'react';
import NotFound from '@/components/pages/not-found';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { Props } from './types';
import { TasticProps } from '../types';

const NotFoundTastic = ({ data: { link, linkName, ...data } }: TasticProps<Props>) => {
  return <NotFound {...data} link={resolveReference(link, linkName)} />;
};

export default NotFoundTastic;

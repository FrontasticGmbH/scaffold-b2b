import React from 'react';
import Footer from '@/components/organisms/footer';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { TasticProps } from '../types';
import { Props } from './types';

const FooterTastic = ({ data }: TasticProps<Props>) => {
  return <Footer {...data} links={data.links.map((link) => resolveReference(link.href, link.name))} />;
};

export default FooterTastic;

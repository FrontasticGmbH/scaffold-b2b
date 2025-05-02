'use client';

import dynamic from 'next/dynamic';
import { BannerProps } from '@/components/molecules/banner';
import { TasticProps } from '../types';

const BannerClientWrapper = dynamic(() => import('./components/banner-client-wrapper'));

const BannerTastic = ({ data }: TasticProps<BannerProps>) => {
  return <BannerClientWrapper {...data} />;
};

export default BannerTastic;

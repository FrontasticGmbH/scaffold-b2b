import React from 'react';
import { SpacerProps } from '@/components/atoms/spacer/types';
import Spacer from '@/components/atoms/spacer';
import { TasticProps } from '../types';

const SpacerTastic = ({ data }: TasticProps<SpacerProps>) => {
  return <Spacer {...data} />;
};

export default SpacerTastic;

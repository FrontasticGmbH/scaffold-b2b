'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Props } from './types';
import { TasticProps } from '../types';

const CheckoutClientWrapper = dynamic(() => import('./components/checkout-client-wrapper'));

const CheckoutTastic = (props: TasticProps<Props>) => {
  return <CheckoutClientWrapper {...props} />;
};

export default CheckoutTastic;

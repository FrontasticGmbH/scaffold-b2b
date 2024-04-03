'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Props } from './types';
import { TasticProps } from '../types';

const QuoteCheckoutClientWrapper = dynamic(() => import('./components/quote-checkout-client-wrapper'));

const QuoteCheckoutTastic = (props: TasticProps<Props>) => {
  return <QuoteCheckoutClientWrapper {...props} />;
};

export default QuoteCheckoutTastic;

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const QuoteThankYouClientWrapper = dynamic(() => import('./components/quote-thank-you-client-wrapper'));

const QuoteThankYouTastic = () => {
  return <QuoteThankYouClientWrapper />;
};

export default QuoteThankYouTastic;

'use client';

import dynamic from 'next/dynamic';

const QuotesClientWrapper = dynamic(() => import('./components/quotes-client-wrapper'));

const QuotesTastic = () => {
  return <QuotesClientWrapper />;
};

export default QuotesTastic;

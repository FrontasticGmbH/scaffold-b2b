import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import { QuoteThankYouProps } from '../../types';

const ReviewOrder = ({ onReviewQuoteClick }: Pick<QuoteThankYouProps, 'onReviewQuoteClick'>) => {
  const { translate } = useTranslation();

  return (
    <div className="mt-2 border-b border-neutral-400 pb-6 pt-4 lg:border-none lg:pb-0">
      <span className="font-semibold text-gray-700 md:text-18 lg:text-20">{translate('thank-you.quotes')}</span>
      <p className="mt-2 text-14 text-gray-700 md:text-16">{translate('thank-you.manage.quotes')}</p>
      <Button variant="primary" size="m" className="mt-6 w-full md:w-[228px]" onClick={onReviewQuoteClick}>
        {translate('thank-you.review.quote')}
      </Button>
    </div>
  );
};

export default ReviewOrder;

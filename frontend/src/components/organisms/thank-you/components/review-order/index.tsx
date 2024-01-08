import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import { ThankYouProps } from '../../types';

const ReviewOrder = ({ onReviewOrderClick }: Pick<ThankYouProps, 'onReviewOrderClick'>) => {
  const { translate } = useTranslation();

  return (
    <div className="border-b border-neutral-400 pb-6 pt-4 lg:border-none lg:pb-0">
      <span className="text-gray-700 md:text-18 lg:text-20">{translate('thank-you.orders')}</span>
      <p className="mt-4 text-14 text-gray-700 md:text-16">{translate('thank-you.manage.orders')}</p>
      <Button variant="primary" size="m" className="mt-6 w-full md:w-[228px]" onClick={onReviewOrderClick}>
        {translate('thank-you.review.order')}
      </Button>
    </div>
  );
};

export default ReviewOrder;

import React from 'react';
import { useTranslations } from 'use-intl';
import Button from '@/components/atoms/button';
import { QuoteThankYouProps } from '../../types';

const Acknowledge = ({ account }: Pick<QuoteThankYouProps, 'account'>) => {
  const translate = useTranslations();

  return (
    <div className="border-b border-b-neutral-400 py-1 text-center lg:border-none lg:pt-0 lg:text-left">
      <p className="font-semibold text-gray-800 md:text-20 lg:text-24">
        {translate('thank-you.quote-request-submitted')}
      </p>
      <p className="mt-2 text-14 font-normal text-gray-600 md:text-16">
        {translate('thank-you.quote-request-submitted-desc')} <b className="font-semibold">{account.email}</b>.
      </p>
      <Button className="mb-3 mt-6 w-full md:w-[228px] lg:hidden" variant="secondary" size="m" disabled>
        {translate('thank-you.download-invoice')}
      </Button>
    </div>
  );
};

export default Acknowledge;

import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import { ThankYouProps } from '../../types';

const Acknowledge = ({ account }: Pick<ThankYouProps, 'account'>) => {
  const { translate } = useTranslation();

  return (
    <div className="border-b border-b-neutral-400 py-6 text-center lg:border-none lg:pt-0 lg:text-left">
      <p className="text-gray-700 md:text-20 lg:text-24">{translate('thank-you.thank.for.order')}</p>
      <p className="mt-4 text-14 text-gray-600 md:text-16">
        {translate('thank-you.email.sent')} <span className="font-medium">{account.email}</span>,{' '}
        {translate('thank-you.email.sent.issue')}
      </p>
      <Button className="mt-6 w-full md:w-[228px] lg:hidden" variant="secondary" size="m" disabled>
        {translate('thank-you.download.invoice')}
      </Button>
    </div>
  );
};

export default Acknowledge;

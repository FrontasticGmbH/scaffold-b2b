import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ThankYouProps } from '../../types';

const Acknowledge = ({ account }: Pick<ThankYouProps, 'account'>) => {
  const { translate } = useTranslation();

  return (
    <div className="border-b border-b-neutral-400 py-2 text-center lg:border-none lg:pt-0 lg:text-left">
      <p className="font-semibold text-gray-800 md:text-20 lg:text-24">{translate('thank-you.thank.for.order')}</p>
      <p className="mt-2 text-14 text-gray-600 md:text-16">
        {translate('thank-you.email.sent')} <span className="font-semibold">{account.email}</span>,{' '}
        {translate('thank-you.email.sent.issue')}
      </p>
    </div>
  );
};

export default Acknowledge;

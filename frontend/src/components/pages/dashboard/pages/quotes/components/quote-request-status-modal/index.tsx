import React from 'react';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import { useTranslations } from 'use-intl';
import QuoteStatusTag from '@/components/pages/dashboard/components/quote-status-tag';
import { QuoteStatus } from '@/types/entity/quote';

const QuotesRequestStatusModal = (props: React.ComponentProps<typeof ResponsiveModal>) => {
  const translate = useTranslations();

  const statuses = ['submitted', 'cancelled', 'rejected', 'accepted'] as Array<QuoteStatus>;

  return (
    <ResponsiveModal {...props} closeButton className="md:max-w-[400px] lg:max-w-[800px]">
      <div className="p-4 md:p-6 lg:px-12">
        <h5 className="font-semibold text-gray-700 md:text-20">{translate('dashboard.quote-request-status')}</h5>
        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-5 md:gap-5 lg:mt-6">
          {statuses.map((status) => (
            <div key={status}>
              <QuoteStatusTag status={status} />
              <p className="mt-2 text-14 text-gray-800">
                {
                  // eslint-disable-next-line
                  // @ts-ignore
                  translate(`dashboard.quote-request-status-${status}-desc`)
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default QuotesRequestStatusModal;

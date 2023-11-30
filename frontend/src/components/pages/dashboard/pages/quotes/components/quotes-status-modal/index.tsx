import React from 'react';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import QuoteStatusTag from '@/components/pages/dashboard/components/quote-status-tag';
import { QuoteStatus } from '@/types/entity/quote';

const QuotesStatusModal = (props: React.ComponentProps<typeof ResponsiveModal>) => {
  const { translate } = useTranslation();

  const statuses = ['inprogress', 'declined', 'renegotiating', 'accepted', 'withdrawn'] as Array<QuoteStatus>;

  return (
    <ResponsiveModal {...props} closeButton className="md:max-w-[400px] lg:max-w-[800px]">
      <div className="p-4 md:p-6 lg:px-12">
        <h5 className="font-semibold text-gray-700 md:text-20">{translate('dashboard.quote.status')}</h5>
        <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5 lg:mt-6">
          {statuses.map((status) => (
            <div key={status}>
              <QuoteStatusTag status={status} />
              <p className="mt-2 text-14 text-gray-800">{translate(`dashboard.quote.status.${status}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default QuotesStatusModal;

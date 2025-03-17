import React from 'react';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import { useTranslations } from 'use-intl';
import { ApprovalFlowStatus } from '@/types/entity/approval-flow';
import ApprovalFlowStatusTag from '@/components/pages/dashboard/components/approval-flow-status-tag';

const StatusModal = (props: React.ComponentProps<typeof ResponsiveModal>) => {
  const translate = useTranslations();

  const statuses = ['pending', 'accepted', 'rejected'] as Array<ApprovalFlowStatus>;

  return (
    <ResponsiveModal {...props} closeButton className="md:max-w-[400px] lg:max-w-[800px]">
      <div className="p-4 md:p-6 lg:px-12">
        <h5 className="font-semibold text-gray-700 md:text-20">{translate('dashboard.quote-status')}</h5>
        <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5 lg:mt-6">
          {statuses.map((status) => (
            <div key={status}>
              <ApprovalFlowStatusTag status={status} />
              <p className="mt-2 text-14 text-gray-800">{translate(`dashboard.approval-flow-status-${status}-desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default StatusModal;

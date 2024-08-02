import React from 'react';
import { Variant as TagVariant } from '@/components/atoms/tag/types';
import Tag from '@/components/atoms/tag';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ApprovalFlowStatus } from '@/types/entity/approval-flow';
import { Props } from './types';

const ApprovalFlowStatusTag = ({ status }: Props) => {
  const { translate } = useTranslation();

  const statusVariant = {
    accepted: 'success',
    rejected: 'danger',
    pending: 'warning',
  } as Record<ApprovalFlowStatus, TagVariant>;

  return (
    <Tag className="capitalize" variant={statusVariant[status]}>
      {translate(`dashboard.approval.flow.status.${status}`)}
    </Tag>
  );
};

export default ApprovalFlowStatusTag;

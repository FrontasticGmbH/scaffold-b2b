import React from 'react';
import { Variant as TagVariant } from '@/components/atoms/tag/types';
import Tag from '@/components/atoms/tag';
import { QuoteStatus } from '@/types/entity/quote';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Props } from './types';

const QuoteStatusTag = ({ status }: Props) => {
  const { translate } = useTranslation();

  const statusVariant = {
    accepted: 'success',
    inprogress: 'primary',
    waiting: 'warning',
    renegotiated: 'primary',
    declined: 'danger',
    withdrawn: 'danger',
    submitted: 'warning',
    cancelled: 'danger',
    rejected: 'danger',
    sent: 'primary',
    closed: 'danger',
  } as Record<QuoteStatus, TagVariant>;

  return (
    <Tag className="capitalize" variant={statusVariant[status]}>
      {translate(`dashboard.quote.status.${status}`)}
    </Tag>
  );
};

export default QuoteStatusTag;

import React from 'react';
import Select from '@/components/atoms/select';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import InfoBanner from '@/components/molecules/info-banner';
import { ApprovalRulesPageProps } from './types';
import ApprovalRulesTable from './components/approval-rules-table';

const ApprovalRulesPage = ({
  viewOnly,
  initialBusinessUnit,
  onBusinessUnitChange,
  businessUnitOptions,
  approvalRules,
  pagination,
  onDuplicate,
}: ApprovalRulesPageProps) => {
  const { translate } = useTranslation();

  return (
    <div>
      {viewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b> {translate('dashboard.rule.view.only.desc')}
        </InfoBanner>
      )}

      <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
        {translate('common.approval.rules')}
      </h1>

      <div className="flex items-end justify-between gap-3">
        <Select
          className="w-[280px]"
          label={translate('common.business.unit')}
          placeholder={translate('common.select')}
          enableSearch
          options={businessUnitOptions}
          defaultValue={initialBusinessUnit}
          onChange={onBusinessUnitChange}
        />

        <Link href="?subPath=add-approval-rule" className="block w-full md:w-fit" underlineOnHover={false}>
          <Button size="m" className="w-full px-6" disabled={viewOnly}>
            {translate('dashboard.approval.rule.add')}
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <ApprovalRulesTable
          approvalRules={approvalRules}
          onDuplicate={onDuplicate}
          pagination={pagination}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
};

export default ApprovalRulesPage;

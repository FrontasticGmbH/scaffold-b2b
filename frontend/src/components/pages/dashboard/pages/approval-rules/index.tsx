import React from 'react';
import Select from '@/components/atoms/select';
import { useTranslations } from 'use-intl';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import InfoBanner from '@/components/molecules/info-banner';
import EmptyState from '@/components/molecules/empty-state';
import Tabs from '@/components/organisms/tabs';
import { ApprovalRulesPageProps } from './types';
import ApprovalRulesTable from './components/approval-rules-table';
import DesktopOnly from '../../components/desktop-only';

const ApprovalRulesPage = ({
  viewOnly,
  initialBusinessUnit,
  onBusinessUnitChange,
  businessUnitOptions,
  approvalRules,
  loading,
  pagination,
  onDuplicate,
  activeTab,
  onTabChange,
}: ApprovalRulesPageProps) => {
  const translate = useTranslations();

  const approvalRulesTable = (
    <>
      {approvalRules.length > 0 ? (
        <ApprovalRulesTable
          approvalRules={approvalRules}
          onDuplicate={onDuplicate}
          pagination={pagination}
          viewOnly={viewOnly}
        />
      ) : (
        <EmptyState isLoading={loading} header={translate('common.no-results-found')} />
      )}
    </>
  );

  return (
    <>
      <div className="hidden lg:block">
        {viewOnly && (
          <InfoBanner className="mt-3">
            <b>{translate('common.view-only')}</b> {translate('dashboard.rule-view-only-desc')}
          </InfoBanner>
        )}

        <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
          {translate('common.approval-rules')}
        </h1>

        <div className="flex items-end justify-between gap-3">
          <Select
            className="w-[280px]"
            label={translate('common.business-unit')}
            placeholder={translate('common.select')}
            enableSearch
            options={businessUnitOptions}
            defaultValue={initialBusinessUnit}
            onChange={onBusinessUnitChange}
          />

          <Link
            href={!viewOnly ? '?subPath=add-approval-rule' : '#'}
            className="block w-full md:w-fit"
            underlineOnHover={false}
          >
            <Button size="m" className="w-full px-6" disabled={viewOnly}>
              {translate('dashboard.approval-rule-add')}
            </Button>
          </Link>
        </div>

        <div className="mt-8">
          <Tabs
            defaultActiveIndex={activeTab === 'active' ? 0 : 1}
            onActiveIndexChange={(index) => onTabChange((['active', 'inactive'] as const)[index])}
          >
            <Tabs.TabList>
              <Tabs.Tab>{translate('common.status-active')}</Tabs.Tab>
              <Tabs.Tab>{translate('common.status-inactive')}</Tabs.Tab>
            </Tabs.TabList>
            <Tabs.Panels>
              <Tabs.Panel>{approvalRulesTable}</Tabs.Panel>
              <Tabs.Panel>{approvalRulesTable}</Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </div>
      </div>
      <DesktopOnly />
    </>
  );
};

export default ApprovalRulesPage;

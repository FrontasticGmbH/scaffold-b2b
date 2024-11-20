import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ApprovalFlowStatus } from '@/types/entity/approval-flow';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import useDisclosure from '@/hooks/useDisclosure';
import Select from '@/components/atoms/select';
import Tabs from '@/components/organisms/tabs';
import EmptyState from '@/components/molecules/empty-state';
import Refinements from './components/refinements';
import { ApprovalFlowsPageProps } from './types';
import StatusModal from './components/status-modal';
import ApprovalFlowsTable from './components/approval-flows-table';

const ApprovalFlowsPage = ({
  selectedBusinessUnit,
  businessUnitOptions,
  onBusinessUnitChange,
  onSearch,
  selectedStatus,
  onStatusSelectedChange,
  searchValue,
  pagination,
  approvalFlows,
  loading,
}: ApprovalFlowsPageProps) => {
  const { translate } = useTranslation();

  const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure();

  const tabsIndexMapper = ['pending', 'accepted', 'rejected'] as ApprovalFlowStatus[];

  const RefinementsPanel = (
    <Refinements searchValue={searchValue} onSearch={(val) => onSearch(val)} onInfoClick={onStatusModalOpen} />
  );

  const ApprovalFlowsPanel =
    approvalFlows.length > 0 ? (
      <ApprovalFlowsTable approvalFlows={approvalFlows} pagination={pagination} />
    ) : (
      <EmptyState isLoading={loading} header={translate('common.no.results.found')} />
    );

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between py-6 md:py-7 lg:py-9">
        <div className="flex items-center gap-3">
          <h1 className="text-18 font-extrabold text-gray-800 md:text-20 lg:text-24">
            {translate(`common.approval.flows`)}
          </h1>
          {approvalFlows.length > 0 && (
            <div className="rounded-md bg-primary px-[6px] py-[2px] text-12 font-semibold text-white">
              {approvalFlows.length}
            </div>
          )}
        </div>
        <InfoIcon className="size-[24px] cursor-pointer text-gray-600 md:hidden" onClick={onStatusModalOpen} />
      </div>

      <div>
        <Select
          className="w-[280px]"
          label={translate('common.business.unit')}
          placeholder={translate('common.select')}
          enableSearch
          options={businessUnitOptions}
          value={selectedBusinessUnit?.key}
          onChange={onBusinessUnitChange}
        />
      </div>

      <div className="mt-11">
        <Tabs
          defaultActiveIndex={tabsIndexMapper.indexOf(selectedStatus)}
          onActiveIndexChange={(index) => onStatusSelectedChange(tabsIndexMapper[index])}
        >
          <Tabs.TabList>
            <Tabs.Tab>{translate(`dashboard.approval.flow.status.pending`)}</Tabs.Tab>
            <Tabs.Tab>{translate(`dashboard.approval.flow.status.accepted`)}</Tabs.Tab>
            <Tabs.Tab>{translate(`dashboard.approval.flow.status.rejected`)}</Tabs.Tab>
          </Tabs.TabList>
          <Tabs.Panels className="overflow-visible">
            <Tabs.Panel>
              {RefinementsPanel}
              {ApprovalFlowsPanel}
            </Tabs.Panel>
            <Tabs.Panel>
              {RefinementsPanel}
              {ApprovalFlowsPanel}
            </Tabs.Panel>
            <Tabs.Panel>
              {RefinementsPanel}
              {ApprovalFlowsPanel}
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>

      <StatusModal isOpen={isStatusModalOpen} onRequestClose={onStatusModalClose} />
    </div>
  );
};

export default ApprovalFlowsPage;

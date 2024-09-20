'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';
import ApprovalFlowsPage from '@/components/pages/dashboard/pages/approval-flows';
import useCustomRouter from '@/hooks/useCustomRouter';
import { ApprovalFlowStatus } from '@/types/entity/approval-flow';
import useApprovalFlows from '@/lib/hooks/useApprovalFlows';
import { mapApprovalFlow, mapCoCoApprovalFlowStatus } from '@/utils/mappers/map-approval-flow';
import useBusinessUnit from '../../hooks/useBusinessUnit';
import useRefinements from '../../hooks/useRefinements';

const ApprovalFlowsClientWrapper = () => {
  const router = useCustomRouter();

  const searchParams = useSearchParams();

  const defaultStatus = searchParams.get('selected') ?? 'pending';

  const [selectedStatus, setSelectedStatus] = useState<ApprovalFlowStatus>(defaultStatus as ApprovalFlowStatus);

  const { activeBusinessUnit, onBusinessUnitSelected, businessUnits } = useBusinessUnit();

  const { account } = useAccount();

  const refinements = {
    pending: useRefinements(),
    accepted: useRefinements(),
    rejected: useRefinements(),
  } as Record<ApprovalFlowStatus, ReturnType<typeof useRefinements>>;

  const { approvalFlows, isLoading, totalItems, previousCursor, nextCursor } = useApprovalFlows({
    businessUnitKey: activeBusinessUnit?.key,
    filters: {
      searchQuery: refinements[selectedStatus].debouncedSearch,
      status: mapCoCoApprovalFlowStatus(selectedStatus),
      cursor: refinements[selectedStatus].cursor,
    },
  });

  return (
    <Dashboard href={DashboardLinks.approvalFlows} userName={account?.firstName}>
      <ApprovalFlowsPage
        initialBusinessUnit={activeBusinessUnit?.key}
        businessUnitOptions={businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' }))}
        onBusinessUnitChange={onBusinessUnitSelected}
        onSearch={(val) => refinements[selectedStatus].setSearch(val)}
        selectedStatus={selectedStatus}
        onStatusSelectedChange={(status) => {
          setSelectedStatus(status);
          router.replace(`?selected=${status}`);
        }}
        searchValue={refinements[selectedStatus].search}
        pagination={{
          page: refinements[selectedStatus].page,
          totalItems: totalItems,
          limit: refinements[selectedStatus].limit,
          onPrevious() {
            if (previousCursor) refinements[selectedStatus].setCursor(previousCursor);
          },
          onNext() {
            if (nextCursor) refinements[selectedStatus].setCursor(nextCursor);
          },
          onRowsPerPageChange(newLimit: string) {
            refinements[selectedStatus].setLimit(+newLimit);
          },
        }}
        approvalFlows={approvalFlows.map(mapApprovalFlow)}
        loading={isLoading}
      />
    </Dashboard>
  );
};

export default ApprovalFlowsClientWrapper;

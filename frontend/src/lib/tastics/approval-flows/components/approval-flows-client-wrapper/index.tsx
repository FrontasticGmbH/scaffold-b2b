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
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { generateApprovalRulesConfig } from '@/lib/tastics/approval-rules/config/approval-rules';
import { mapCountry } from '@/utils/mappers/map-country';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useRefinements from '../../hooks/useRefinements';

const ApprovalFlowsClientWrapper = () => {
  const router = useCustomRouter();

  const searchParams = useSearchParams();

  const defaultStatus = searchParams.get('selected') ?? 'pending';

  const { projectSettings } = useProjectSettings();

  const approvalRulesConfig = generateApprovalRulesConfig({
    countries: (projectSettings?.countries ?? []).map(mapCountry),
  });

  const [selectedStatus, setSelectedStatus] = useState<ApprovalFlowStatus>(defaultStatus as ApprovalFlowStatus);

  const { businessUnits } = useBusinessUnits();

  const { selectedBusinessUnit, setSelectedBusinessUnitKey } = useStoreAndBusinessUnits();

  const { account } = useAccount();

  const refinements = {
    pending: useRefinements(),
    accepted: useRefinements(),
    rejected: useRefinements(),
  } as Record<ApprovalFlowStatus, ReturnType<typeof useRefinements>>;

  const { approvalFlows, isLoading, totalItems, previousCursor, nextCursor } = useApprovalFlows({
    businessUnitKey: selectedBusinessUnit?.key,
    filters: {
      searchQuery: refinements[selectedStatus].debouncedSearch,
      status: mapCoCoApprovalFlowStatus(selectedStatus),
      cursor: refinements[selectedStatus].cursor,
    },
  });

  return (
    <Dashboard href={DashboardLinks.approvalFlows} userName={account?.firstName}>
      <ApprovalFlowsPage
        selectedBusinessUnit={selectedBusinessUnit}
        businessUnitOptions={businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' }))}
        onBusinessUnitChange={setSelectedBusinessUnitKey}
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
        approvalFlows={approvalFlows.map((flow) => mapApprovalFlow(flow, approvalRulesConfig))}
        loading={isLoading}
      />
    </Dashboard>
  );
};

export default ApprovalFlowsClientWrapper;

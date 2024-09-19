'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '@/lib/tastics/types';
import { DataSource } from '@/types/lib/datasources';
import ApprovalFlowDetailsPage from '@/components/pages/dashboard/pages/approval-flow-details';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { mapApprovalFlow } from '@/utils/mappers/map-approval-flow';
import { ApprovalFlow } from '@shared/types/business-unit';
import useCustomRouter from '@/hooks/useCustomRouter';
import useApprovalFlows from '@/lib/hooks/useApprovalFlows';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { mapCountry } from '@/utils/mappers/map-country';
import { generateApprovalRulesConfig } from '@/lib/tastics/approval-rules/config/approval-rules';

const ApprovalFlowsClientWrapper = ({ data }: TasticProps<DataSource<ApprovalFlow>>) => {
  const router = useCustomRouter();

  const approvalFlow = data.data?.dataSource;

  const { projectSettings } = useProjectSettings();

  const approvalRulesConfig = generateApprovalRulesConfig({
    countries: (projectSettings?.countries ?? []).map(mapCountry),
  });

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { account } = useAccount();

  const { roles } = useAccountRoles();

  const { approveApprovalFlow, rejectApprovalFlow } = useApprovalFlows({ businessUnitKey: selectedBusinessUnit?.key });

  if (!approvalFlow) return <></>;

  return (
    <Dashboard userName={account?.firstName}>
      <ApprovalFlowDetailsPage
        approvalFlow={mapApprovalFlow(approvalFlow, approvalRulesConfig)}
        userRoles={roles.map((role) => ({ key: role.key as string, name: role.name }))}
        viewOnly={!permissions.UpdateApprovalFlows}
        onApprove={async () => {
          const res = await approveApprovalFlow(approvalFlow.approvalFlowId);

          if (res?.approvalFlowId) router.refresh();

          return !!res?.approvalFlowId;
        }}
        onReject={async (reason) => {
          const res = await rejectApprovalFlow(approvalFlow.approvalFlowId, reason);

          if (res?.approvalFlowId) router.refresh();

          return !!res?.approvalFlowId;
        }}
      />
    </Dashboard>
  );
};

export default ApprovalFlowsClientWrapper;

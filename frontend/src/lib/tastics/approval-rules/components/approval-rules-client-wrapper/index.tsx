'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ApprovalRulesPageProps } from '@/components/pages/dashboard/pages/approval-rules/types';
import ApprovalRulesPage from '@/components/pages/dashboard/pages/approval-rules';
import useApprovalRules from '@/lib/hooks/useApprovalRules';
import { mapApprovalRule, mapCoCoApprovalRule } from '@/utils/mappers/map-approval-rule';
import useRoles from '@/lib/hooks/useRoles';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useBusinessUnit from '../../hooks/useBusinessUnit';
import useSubPath from '../../hooks/useSubPath';
import useRefinements from '../../hooks/useRefinements';
import { approvalRulesConfig } from '../../config/approval-rules';

const ApprovalRulesTastic = () => {
  const { translate } = useTranslation();

  const router = useCustomRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const { activeBusinessUnit, onBusinessUnitSelected, businessUnits } = useBusinessUnit();

  const { account } = useAccount();

  const { page, limit, setLimit, cursor, setCursor } = useRefinements();

  const { approvalRules, isLoading, totalItems, previousCursor, nextCursor, createApprovalRule, updateApprovalRule } =
    useApprovalRules({
      businessUnitKey: activeBusinessUnit?.key,
      storeKey: activeBusinessUnit.stores?.[0].key,
      filters: { cursor, limit },
    });

  const { data: rolesData } = useRoles();

  const { permissions } = useAccountRoles(activeBusinessUnit.key);

  const approvalRulesPageProps = {
    viewOnly: !(permissions.CreateApprovalRules && permissions.UpdateApprovalRules),
    businessUnitOptions: businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' })),
    initialBusinessUnit: activeBusinessUnit?.key,
    onBusinessUnitChange: onBusinessUnitSelected,
    approvalRules: approvalRules.map(mapApprovalRule),
    loading: isLoading,
    roles: rolesData.map((role) => ({ name: role.name, value: role.key })),
    rulesCriteria: Object.entries(approvalRulesConfig).map(([key, config]) => ({
      key,
      type: config.type,
      name: translate(config.name),
      operators: config.operators.map((operator) => ({ name: translate(operator.name), value: operator.value })),
      values: (config.values ?? []).map((value) => ({ name: translate(value.name), value: value.value })),
    })),
    approversCriteria: rolesData.map(({ key, name }) => ({
      key,
      name: name ?? key,
      type: 'text',
      operators: [],
      values: [],
    })),
    pagination: {
      page,
      totalItems,
      limit,
      onPrevious() {
        if (previousCursor) setCursor(previousCursor);
      },
      onNext() {
        if (nextCursor) setCursor(nextCursor);
      },
      onRowsPerPageChange(newLimit: string) {
        setLimit(+newLimit);
      },
    },
    async onDuplicate(approvalRule) {
      const cocoApprovalRule = mapCoCoApprovalRule(approvalRule);

      const response = await createApprovalRule(cocoApprovalRule);

      const success = !!response?.approvalRuleId;

      return success;
    },
    async onSubmit(approvalRule) {
      const cocoApprovalRule = mapCoCoApprovalRule(approvalRule);

      const response = await (id ? updateApprovalRule(id, cocoApprovalRule) : createApprovalRule(cocoApprovalRule));

      const success = !!response?.approvalRuleId;

      if (success) router.back();

      return success;
    },
  } as ApprovalRulesPageProps;

  const { ActiveSubPath } = useSubPath(approvalRulesPageProps);

  return (
    <Dashboard title={ActiveSubPath?.title} href={DashboardLinks.approvalRules} userName={account?.firstName}>
      {ActiveSubPath?.Component ?? <ApprovalRulesPage {...approvalRulesPageProps} />}
    </Dashboard>
  );
};

export default ApprovalRulesTastic;

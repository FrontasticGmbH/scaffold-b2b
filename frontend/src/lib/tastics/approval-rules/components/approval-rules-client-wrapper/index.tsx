'use client';

import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';
import { useTranslations } from 'use-intl';
import { ApprovalRulesPageProps } from '@/components/pages/dashboard/pages/approval-rules/types';
import ApprovalRulesPage from '@/components/pages/dashboard/pages/approval-rules';
import useApprovalRules from '@/lib/hooks/useApprovalRules';
import { mapApprovalRule, mapCoCoApprovalRule } from '@/utils/mappers/map-approval-rule';
import useRoles from '@/lib/hooks/useRoles';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { mapCountry } from '@/utils/mappers/map-country';
import { mutate } from 'swr';
import useBusinessUnit from '../../hooks/useBusinessUnit';
import useSubPath from '../../hooks/useSubPath';
import useRefinements from '../../hooks/useRefinements';
import { generateApprovalRulesConfig } from '../../config/approval-rules';

const ApprovalRulesTastic = () => {
  const translate = useTranslations();

  const router = useCustomRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const { projectSettings } = useProjectSettings();

  const approvalRulesConfig = generateApprovalRulesConfig({
    countries: (projectSettings?.countries ?? []).map(mapCountry),
  });

  const { activeBusinessUnit, onBusinessUnitSelected, businessUnits } = useBusinessUnit();

  const { account } = useAccount();

  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  const activeRefinements = useRefinements();
  const inactiveRefinements = useRefinements();

  const { page, limit, setLimit, cursor, setCursor } = activeTab === 'active' ? activeRefinements : inactiveRefinements;

  const activeApprovalRules = useApprovalRules({
    businessUnitKey: activeBusinessUnit?.key,
    storeKey: activeBusinessUnit.stores?.[0].key,
    filters: { cursor, limit, statuses: ['Active'] },
  });
  const inactiveApprovalRules = useApprovalRules({
    businessUnitKey: activeBusinessUnit?.key,
    storeKey: activeBusinessUnit.stores?.[0].key,
    filters: { cursor, limit, statuses: ['Inactive'] },
  });

  const { approvalRules, isLoading, totalItems, previousCursor, nextCursor, createApprovalRule, updateApprovalRule } =
    activeTab === 'active' ? activeApprovalRules : inactiveApprovalRules;

  const updateApprovalRuleWithMutation = useCallback(
    async (...params: Parameters<typeof updateApprovalRule>) => {
      const res = await updateApprovalRule(...params);
      if (!!res?.approvalRuleId) {
        mutate(
          (key) =>
            Array.isArray(key) &&
            key?.[0] === '/action/business-unit/queryApprovalRules' &&
            key?.[1] === activeBusinessUnit?.key,
        );
      }
      return res;
    },
    [updateApprovalRule, activeBusinessUnit?.key],
  );

  const { data: rolesData } = useRoles();

  const { permissions } = useAccountRoles(activeBusinessUnit.key);

  const approvalRulesPageProps = {
    viewOnly: !(permissions.CreateApprovalRules && permissions.UpdateApprovalRules),
    businessUnitOptions: businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' })),
    initialBusinessUnit: activeBusinessUnit?.key,
    onBusinessUnitChange: onBusinessUnitSelected,
    approvalRules: approvalRules.map((rule) => mapApprovalRule(rule, approvalRulesConfig)),
    activeTab,
    onTabChange: setActiveTab,
    loading: isLoading,
    roles: rolesData.map((role) => ({ name: role.name, value: role.key })),
    rulesCriteria: Object.entries(approvalRulesConfig).map(([key, config]) => ({
      key,
      type: config.type,
      // eslint-disable-next-line
      // @ts-ignore
      name: translate(config.name),
      // eslint-disable-next-line
      // @ts-ignore
      operators: config.operators.map((operator) => ({ name: translate(operator.name), value: operator.value })),
      values: (config.values ?? []).map((value) => ({
        name:
          key === 'country' || key === 'currency'
            ? value.name
            : // eslint-disable-next-line
              // @ts-ignore
              translate(value.name),
        value: value.value,
      })),
    })),
    approversCriteria: rolesData
      .filter((role) => role.permissions?.includes('UpdateApprovalFlows'))
      .map(({ key, name }) => ({
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
      const cocoApprovalRule = mapCoCoApprovalRule(approvalRule, approvalRulesConfig);

      const response = await createApprovalRule(cocoApprovalRule);

      const success = !!response?.approvalRuleId;

      return success;
    },
    async onSubmit(approvalRule) {
      const cocoApprovalRule = mapCoCoApprovalRule(approvalRule, approvalRulesConfig);

      const response = await (id
        ? updateApprovalRuleWithMutation(id, cocoApprovalRule)
        : createApprovalRule(cocoApprovalRule));

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

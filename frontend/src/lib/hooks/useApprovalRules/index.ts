import { useCallback } from 'react';
import useSWR from 'swr';
import { sdk } from '@/sdk';
import { ApprovalRule } from '@shared/types/business-unit';
import { useApprovalRulesOptions } from './types';

const useApprovalRules = ({
  businessUnitKey,
  storeKey,
  filters: { cursor, limit, ids = [], statuses = [] } = {},
}: useApprovalRulesOptions) => {
  const { data, mutate, ...response } = useSWR(
    !businessUnitKey
      ? null
      : ['/action/business-unit/queryApprovalRules', businessUnitKey, cursor, limit, ids.join(','), statuses.join(',')],
    () =>
      sdk.composableCommerce.businessUnit.queryApprovalRules({
        businessUnitKey: businessUnitKey as string,
        approvalRuleIds: ids,
        approvalRuleStatus: statuses,
        cursor,
        limit,
        sortAttributes: [{ createdAt: 'desc' }],
      }),
  );

  const isLoading = !businessUnitKey || response.isLoading;

  const approvalRules = data?.isError ? [] : (data?.data?.items ?? []);

  const totalItems = data?.isError ? 0 : (data?.data.total ?? 0);

  const [previousCursor, nextCursor] = data?.isError
    ? [undefined, undefined]
    : [data?.data.previousCursor, data?.data.nextCursor];

  const createApprovalRule = useCallback(
    async (approvalRule: ApprovalRule) => {
      if (!businessUnitKey || !storeKey) return;

      const response = await sdk.composableCommerce.businessUnit.createApprovalRule(
        { approvalRule },
        { businessUnitKey, storeKey },
      );

      if (!response.isError) mutate();

      return response.isError ? undefined : response.data;
    },
    [businessUnitKey, storeKey, mutate],
  );

  const updateApprovalRule = useCallback(
    async (approvalRuleId: string, payload: ApprovalRule) => {
      if (!businessUnitKey || !storeKey) return;

      const response = await sdk.composableCommerce.businessUnit.updateApprovalRule(
        { approvalRule: { approvalRuleId, ...payload } },
        { businessUnitKey },
      );

      if (!response.isError) mutate();

      return response.isError ? undefined : response.data;
    },
    [businessUnitKey, storeKey, mutate],
  );

  return { approvalRules, isLoading, totalItems, previousCursor, nextCursor, createApprovalRule, updateApprovalRule };
};

export default useApprovalRules;

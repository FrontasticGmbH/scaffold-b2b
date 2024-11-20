import { useCallback } from 'react';
import useSWR, { useSWRConfig, Key } from 'swr';
import { sdk } from '@/sdk';
import { UseApprovalFlowsOptions } from './types';

const useApprovalFlows = ({
  businessUnitKey,
  filters: { searchQuery, status, cursor } = {},
}: UseApprovalFlowsOptions) => {
  const { data, ...response } = useSWR(
    !businessUnitKey ? null : ['/action/business-unit/queryApprovalFlows', businessUnitKey, searchQuery, status],
    () =>
      sdk.composableCommerce.businessUnit.queryApprovalFlows({
        businessUnitKey: businessUnitKey as string,
        approvalFlowIds: [...(searchQuery ? [searchQuery] : [])],
        approvalFlowStatus: [...(status ? [status] : [])],
        cursor,
        sortAttributes: [{ createdAt: 'desc' }],
      }),
  );

  const isLoading = !businessUnitKey || response.isLoading;

  const { mutate: mutateSwr } = useSWRConfig();

  const mutateAll = useCallback(() => {
    mutateSwr(
      (key: Key) => {
        return typeof key === 'object' && key?.[0].startsWith('/action/business-unit/queryApprovalFlows');
      },
      undefined,
      {
        revalidate: true,
      },
    );
  }, [mutateSwr]);

  const approvalFlows = data?.isError ? [] : (data?.data?.items ?? []);

  const totalItems = data?.isError ? 0 : (data?.data.total ?? 0);

  const [previousCursor, nextCursor] = data?.isError
    ? [undefined, undefined]
    : [data?.data.previousCursor, data?.data.nextCursor];

  const approveApprovalFlow = useCallback(
    async (approvalFlowId: string) => {
      if (!businessUnitKey) return;

      const res = await sdk.composableCommerce.businessUnit.approveApprovalFlow({ approvalFlowId }, { approvalFlowId });

      if (!res?.isError && res.data.approvalFlowId) mutateAll();

      return res.isError ? null : res.data;
    },
    [businessUnitKey, mutateAll],
  );

  const rejectApprovalFlow = useCallback(
    async (approvalFlowId: string, reason?: string) => {
      if (!businessUnitKey) return;

      const res = await sdk.composableCommerce.businessUnit.rejectApprovalFlow(
        { approvalFlowId, reason: reason ?? '' },
        { approvalFlowId, reason: reason ?? '' },
      );

      if (!res?.isError && res.data.approvalFlowId) mutateAll();

      return res.isError ? null : res.data;
    },
    [businessUnitKey, mutateAll],
  );

  return {
    approvalFlows,
    isLoading,
    totalItems,
    previousCursor,
    nextCursor,
    approveApprovalFlow,
    rejectApprovalFlow,
    mutateAll,
  };
};

export default useApprovalFlows;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InfoBanner from '@/components/molecules/info-banner';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Link from '@/components/atoms/link';
import ActivityLog from '@/components/molecules/activity-log';
import { Approver } from '@/types/entity/approval-flow';
import { Group, Rule } from '@/components/organisms/rule-builder/types';
import useFormat from '@/hooks/useFormat';
import { ActivityLogProps } from '@/components/molecules/activity-log/types';
import { ApprovalFlowDetailsPageProps } from './types';
import PreviousPageLink from '../../components/previous-page-link';
import ApprovalFlowStatusTag from '../../components/approval-flow-status-tag';
import { DashboardLinks } from '../../constants';
import OrderDetailsPage from '../order-details';

const ApprovalFlowDetailsPage = ({
  approvalFlow,
  userRoles,
  viewOnly,
  onApprove,
  onReject,
}: ApprovalFlowDetailsPageProps) => {
  const { translate } = useTranslation();

  const { formatPosition } = useFormat();

  const isInApproverTiers = useCallback((approver: Approver, tier: Group | Rule): boolean => {
    if (tier.type === 'rule') return approver.key === tier.key;

    return tier.rules.some((r) => isInApproverTiers(approver, r));
  }, []);

  //Next tier index to be approved
  const currentPendingTierIndex = (approvalFlow.rules?.[0].approvers ?? []).findIndex((rule) =>
    (approvalFlow.currentPendingApproverTiers ?? []).some((approver) => isInApproverTiers(approver, rule)),
  );

  //Next tier the current user can approve
  const currentUserPendingTierIndex = (approvalFlow.rules?.[0].approvers ?? []).findIndex(
    (rule) =>
      userRoles.some((role) => isInApproverTiers(role, rule)) &&
      userRoles.some((role) => (approvalFlow.currentPendingApproverTiers ?? []).some((r) => r.key === role.key)),
  );

  const [rejectionReasonTextarea, setRejectionReasonTextarea] = useState<Record<number, boolean>>({});

  const [orderCreationDateFromatted, setOrderCreationDateFormatted] = useState('');
  const [approvalFlowRejectionDate, setApprovalFlowRejectionDate] = useState('');
  const [approvalsDateFormatted, setApprovalsDateFormatted] = useState<Record<number, string>>({});

  const dateFormattingOptions: Intl.DateTimeFormatOptions = useMemo(
    () => ({
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: undefined,
    }),
    [],
  );

  useEffect(() => {
    if (!approvalFlow.order?.creationDate) return;

    setOrderCreationDateFormatted(
      new Date(approvalFlow.order?.creationDate).toLocaleString(undefined, dateFormattingOptions),
    );
  }, [approvalFlow.order, dateFormattingOptions]);

  useEffect(() => {
    if (!approvalFlow.rejection?.rejectedAt) return;

    setApprovalFlowRejectionDate(
      new Date(approvalFlow.rejection?.rejectedAt).toLocaleString(undefined, dateFormattingOptions),
    );
  }, [approvalFlow.rejection, dateFormattingOptions]);

  useEffect(() => {
    if (!approvalFlow.approvals.length) return;

    setApprovalsDateFormatted(
      approvalFlow.approvals.reduce(
        (acc, approval, index) => ({
          ...acc,
          [index]: approval.approvedAt
            ? new Date(approval.approvedAt).toLocaleString(undefined, dateFormattingOptions)
            : '',
        }),
        {},
      ),
    );
  }, [approvalFlow.approvals, dateFormattingOptions]);

  return (
    <div>
      {viewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b> {translate('dashboard.flow.view.only.desc')}
        </InfoBanner>
      )}

      <div className="flex items-center justify-between">
        <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
          {translate('dashboard.flow.details')}
        </h1>
        <div className="hidden items-center justify-normal gap-x-3 md:flex">
          <PreviousPageLink />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-14 text-gray-600">
          {translate('dashboard.flow.id')}: {approvalFlow.id}
        </h3>

        <h3 className="flex items-center gap-2 text-14 text-gray-600">
          <span>{translate('common.status')}:</span>
          <ApprovalFlowStatusTag status={approvalFlow.status} />
        </h3>

        <h3 className="flex items-center gap-1 text-14 text-gray-600">
          <span>{translate('dashboard.rules.applied')}:</span>
          {(approvalFlow.rules ?? []).map((rule, index, arr) => (
            <div key={rule.id}>
              <Link
                href={`${DashboardLinks.approvalRules}?subPath=edit-approval-rule&id=${rule.id}`}
                className="text-primary underline"
              >
                {rule.name}
              </Link>
              {index < arr.length - 1 && <span>,</span>}
            </div>
          ))}
        </h3>
      </div>

      <div className="mt-[64px] border-t border-neutral-400 py-8">
        <h5 className="pb-9 text-18 text-gray-700">{translate('common.activity')}</h5>

        <div className="pl-8">
          <ActivityLog
            activities={[
              {
                title: translate('dashboard.order.created'),
                summary: orderCreationDateFromatted,
              },
              ...(approvalFlow.status === 'rejected'
                ? [
                    {
                      title: `${translate('dashboard.flow.rejected')} ${
                        approvalFlow.rejection?.rejecter.name
                          ? `${translate('common.by')} ${approvalFlow.rejection.rejecter.name}`
                          : ''
                      }`,
                      summary: approvalFlowRejectionDate,
                      comment: approvalFlow.rejection?.reason ?? '',
                      commentDisabled: true,
                    } as ActivityLogProps['activities'][0],
                  ]
                : (approvalFlow.rules?.[0].approvers ?? []).map((rule, index) => {
                    const flowApprovals = approvalFlow.approvals.filter((approval) =>
                      approval.approver.roles.some((role) => isInApproverTiers(role, rule)),
                    );

                    return {
                      title:
                        approvalFlow.status === 'pending' && index >= currentPendingTierIndex
                          ? `${translate('dashboard.await.reply.from.tier', {
                              values: { tier: formatPosition(index + 1) },
                            })}`
                          : `${translate('dashboard.tier.approved', {
                              values: { tier: formatPosition(index + 1) },
                            })} ${flowApprovals.length > 0 ? `${translate('common.by')} ${flowApprovals.map((flowApproval) => flowApproval.approver.name).join(', ')}` : ''}`,
                      summary:
                        currentPendingTierIndex === -1 || index < currentPendingTierIndex
                          ? approvalsDateFormatted[
                              flowApprovals.reduce(
                                (acc, flowApproval, i) =>
                                  acc[1] > new Date(flowApproval.approvedAt)
                                    ? acc
                                    : [i, new Date(flowApproval.approvedAt)],
                                [-1, new Date(flowApprovals[0].approvedAt)],
                              )[0] as number
                            ]
                          : '',
                      reply:
                        approvalFlow.status === 'pending' &&
                        index === currentUserPendingTierIndex &&
                        !rejectionReasonTextarea[index],
                      comment: rejectionReasonTextarea[index] ? ' ' : '',
                      canAccept: !viewOnly,
                      canReject: !viewOnly,
                      onAccept: onApprove,
                      onReject: () => setRejectionReasonTextarea({ ...rejectionReasonTextarea, [index]: true }),
                      onCommentCancel: () => setRejectionReasonTextarea({ ...rejectionReasonTextarea, [index]: false }),
                      onCommentUpdate: onReject,
                    } as ActivityLogProps['activities'][0];
                  })),
            ]}
          />
        </div>
      </div>

      <div className="mt-[64px] border-t border-neutral-400">
        <OrderDetailsPage order={approvalFlow.order} showCtaButtons={false} showOrderStatusBar={false} />
      </div>
    </div>
  );
};

export default ApprovalFlowDetailsPage;

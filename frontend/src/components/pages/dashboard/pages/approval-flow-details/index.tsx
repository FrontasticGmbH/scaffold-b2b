import React, { useCallback, useMemo, useState } from 'react';
import InfoBanner from '@/components/molecules/info-banner';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Link from '@/components/atoms/link';
import { Approver } from '@/types/entity/approval-flow';
import { Group, Rule } from '@/components/organisms/rule-builder/types';
import RulePreview from '@/components/organisms/rule-builder/components/rule-preview';
import { classnames } from '@/utils/classnames/classnames';
import { CheckIcon } from '@heroicons/react/24/outline';
import Button from '@/components/atoms/button';
import TextArea from '@/components/atoms/text-area';
import { ApprovalFlowDetailsPageProps } from './types';
import PreviousPageLink from '../../components/previous-page-link';
import ApprovalFlowStatusTag from '../../components/approval-flow-status-tag';
import { DashboardLinks } from '../../constants';
import OrderDetailsPage from '../order-details';

const ApprovalFlowDetailsPage = ({
  approvalFlow,
  userRoles,
  viewOnly,
  approversCriteria = [],
  onApprove,
  onReject,
}: ApprovalFlowDetailsPageProps) => {
  const { translate } = useTranslation();

  const [processing, setProcessing] = useState(false);

  const [rejectionReasonTextarea, setRejectionReasonTextarea] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const maxRejectionReasonCharacters = 160;

  const isInApproverTiers = useCallback((approver: Approver, tier: Group | Rule): boolean => {
    if (tier.type === 'rule') return approver.key === tier.key;

    return tier.rules.some((r) => isInApproverTiers(approver, r));
  }, []);

  const mergedApprovers = useMemo<Group[]>(() => {
    if (!approvalFlow.rules) return [];

    const maxTiersLength = approvalFlow.rules.reduce((acc, curr) => Math.max(acc, curr.approvers?.length ?? 0), 0);

    const tiers = [] as Group[];

    for (let i = 0; i < maxTiersLength; ++i) {
      tiers.push({ type: 'group', combinator: 'AND', rules: [] });

      for (const approvalRule of approvalFlow.rules) {
        if (!approvalRule.approvers?.length) continue;

        if (i < approvalRule.approvers.length) (tiers.at(-1) as Group).rules.push(approvalRule.approvers[i]);
      }
    }

    return tiers;
  }, [approvalFlow.rules]);

  //Next tier index to be approved
  const currentPendingTierIndex = mergedApprovers.findIndex((rule) =>
    (approvalFlow.currentPendingApproverTiers ?? []).some((approver) => isInApproverTiers(approver, rule)),
  );

  //Next tier the current user can approve
  const currentUserPendingTierIndex = mergedApprovers.findIndex(
    (rule) =>
      userRoles.some((role) => isInApproverTiers(role, rule)) &&
      userRoles.some((role) => (approvalFlow.eligibleApprovers ?? []).some((r) => r.key === role.key)),
  );

  //Whether the user can approve current pending tier?
  const userCanApprovePendingTier = currentPendingTierIndex === currentUserPendingTierIndex;

  //Whether the user already approved the flow
  const userHasApproved = approvalFlow.approvals.some((approval) =>
    userRoles.every((role) => !!approval.approver.roles.find((r) => r.key === role.key)),
  );

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
      </div>

      <div className="mt-9 border-t border-neutral-400 pt-10">
        <h5 className="pb-9 text-20 font-bold text-gray-700">{translate('common.approval.flow')}</h5>

        <div>
          <h6 className="text-16 font-semibold text-gray-700">{translate('dashboard.rules.applied')}</h6>
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-md border border-gray-300 p-6">
            {(approvalFlow.rules ?? []).map((rule, index, arr) => (
              <div key={rule.id}>
                <Link
                  href={`${DashboardLinks.approvalRules}?subPath=edit-approval-rule&id=${rule.id}`}
                  className="text-16 text-blue-700 underline"
                >
                  {rule.name}
                </Link>{' '}
                {index < arr.length - 1 && <span>,</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div>
          <h5 className="text-16 font-semibold text-gray-700">
            {translate('dashboard.approval.flow.required.approvers')}
          </h5>
          <div
            className="mt-1 text-16 font-normal text-gray-700"
            dangerouslySetInnerHTML={{
              __html: translate('dashboard.approval.flow.required.approvers.desc', {
                values: {
                  preview: `<div class="w-fit border border-blue-500 p-1 inline-flex items-center gap-1 rounded-sm text-xs text-blue-500">
                    <span>${translate('common.name')}</span>
                    <span class="w-[12px] h-[12px] border border-gray-500 rounded-full block" />
                  </div>`,
                },
              }),
            }}
          />
        </div>

        <div className="mt-4 rounded-md border border-gray-300 px-7">
          {mergedApprovers.map((approver, index, arr) => (
            <div key={index} className={classnames('py-6', { 'border-b border-neutral-400': index < arr.length - 1 })}>
              <div className="flex items-start gap-5">
                <div className="shrink-0 rounded-full bg-neutral-200 px-6 py-1 text-16 font-medium text-gray-700">{`${translate('dashboard.tier')} ${index + 1}`}</div>
                <RulePreview
                  group={approver}
                  criteria={approversCriteria}
                  renderRule={({ key, name }) => {
                    const isUserRole = userRoles.some((role) => role.key === key);
                    const isRoleApproved = approvalFlow.approvals.some(
                      (approval) => !!approval.approver.roles.find((r) => r.key === key),
                    );

                    return (
                      <div
                        className={classnames('flex w-fit items-center gap-2 rounded-sm border px-2 py-1', {
                          'border-gray-300': !isUserRole,
                          'border-blue-500': isUserRole,
                        })}
                      >
                        <span
                          className={classnames({
                            'text-gray-600': !isUserRole,
                            'text-blue-500': isUserRole,
                          })}
                        >
                          {name}
                        </span>
                        <span
                          className={classnames(
                            'flex size-[20px] items-center justify-center rounded-full border-2 p-[3px]',
                            {
                              'border-green-600': isRoleApproved,
                              'border-gray-300': !isRoleApproved,
                            },
                          )}
                        >
                          {isRoleApproved && <CheckIcon className="stroke-[5px] text-green-600" />}
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center pt-6">
                {(approvalFlow.rules ?? []).map((rule, index, arr) => (
                  <div key={rule.id} className="whitespace-pre text-gray-500">
                    {rule.name} {index < arr.length - 1 && <span>,{'  '}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex gap-3">
          {rejectionReasonTextarea ? (
            <form
              className="w-full"
              onSubmit={async (e) => {
                e.preventDefault();
                setProcessing(true);
                await onReject?.(rejectionReason);
                setProcessing(false);
              }}
            >
              <h6 className="mb-3 text-12 font-medium uppercase text-gray-600">
                {translate('dashboard.approval.flow.rejection.reason')}
              </h6>
              <TextArea
                value={rejectionReason}
                className="h-[150px] w-full md:h-[65px]"
                fitContent={false}
                error={
                  rejectionReason.length > maxRejectionReasonCharacters
                    ? translate('dashboard.message.too.long', {
                        values: { maxCharacters: maxRejectionReasonCharacters.toString() },
                      })
                    : ''
                }
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" size="l" onClick={() => setRejectionReasonTextarea(false)}>
                  {translate('common.cancel')}
                </Button>
                <Button type="submit" size="l" variant="primary" loading={processing}>
                  {translate('common.reject')}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Button
                variant="secondary"
                size="l"
                className="leading-[16px]"
                disabled={
                  viewOnly || userHasApproved || !userCanApprovePendingTier || approvalFlow.status !== 'pending'
                }
                onClick={() => {
                  setRejectionReasonTextarea(true);
                }}
              >
                {translate('common.reject')}
              </Button>
              <Button
                variant="primary"
                size="l"
                className="py-[12px] leading-[16px]"
                loading={processing}
                disabled={
                  viewOnly || userHasApproved || !userCanApprovePendingTier || approvalFlow.status !== 'pending'
                }
                onClick={async () => {
                  setProcessing(true);
                  await onApprove?.();
                  setProcessing(false);
                }}
              >
                {translate('common.approve')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-neutral-400">
        <OrderDetailsPage order={approvalFlow.order} showCtaButtons={false} showOrderStatusBar={false} />
      </div>
    </div>
  );
};

export default ApprovalFlowDetailsPage;

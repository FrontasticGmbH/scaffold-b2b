import { ApprovalRuleConfig } from '@/lib/tastics/approval-rules/config/approval-rules';
import { ApprovalFlow, ApprovalFlowStatus } from '@/types/entity/approval-flow';
import {
  ApprovalFlow as CoCoApprovalFlow,
  ApprovalFlowStatus as CoCoApprovalFlowStatus,
} from '@shared/types/business-unit';
import { mapApprovalRule } from './map-approval-rule';
import { mapOrder } from './map-order';

export const mapCoCoApprovalFlowStatus = (status: ApprovalFlowStatus): CoCoApprovalFlowStatus => {
  switch (status) {
    case 'accepted':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending':
    default:
      return 'Pending';
  }
};

export const mapApprovalFlowStatus = (status: CoCoApprovalFlowStatus): ApprovalFlowStatus => {
  switch (status) {
    case 'Approved':
      return 'accepted';
    case 'Rejected':
      return 'rejected';
    case 'Pending':
    default:
      return 'pending';
  }
};

export const mapApprovalFlow = (
  approvalFlow: CoCoApprovalFlow,
  approvalRulesConfig: ApprovalRuleConfig,
): ApprovalFlow => {
  return {
    id: approvalFlow.approvalFlowId,
    date: approvalFlow.order.createdAt ? new Date(approvalFlow.order.createdAt).toISOString() : '',
    status: mapApprovalFlowStatus(approvalFlow.approvalFlowStatus ?? 'Pending'),
    businessUnit: { key: approvalFlow.businessUnitKey },
    rules: approvalFlow.approvalRules.map((rule) => mapApprovalRule(rule, approvalRulesConfig)) ?? [],
    order: mapOrder(approvalFlow.order),
    approvals: (approvalFlow.approvalFlowApprovals ?? []).map((approval) => ({
      approvedAt: approval.approvedAt ? new Date(approval.approvedAt).toISOString() : '',
      approver: {
        key: approval.approver.accountId as string,
        name: `${approval.approver.firstName ?? ''} ${approval.approver.lastName ?? ''}`.trim(),
        roles: (approval.approver.roles ?? []).map(({ key, name }) => ({ key: key ?? '', name: name ?? '' })),
      },
    })),
    rejection: {
      rejectedAt: approvalFlow.approvalFlowRejection?.rejectedAt
        ? new Date(approvalFlow.approvalFlowRejection?.rejectedAt as unknown as string).toISOString()
        : '',
      reason: approvalFlow.approvalFlowRejection?.reason ?? '',
      rejecter: {
        key: approvalFlow.approvalFlowRejection?.rejecter.accountId as string,
        name: `${approvalFlow.approvalFlowRejection?.rejecter.firstName ?? ''} ${
          approvalFlow.approvalFlowRejection?.rejecter.lastName ?? ''
        }`.trim(),
        roles: (approvalFlow.approvalFlowRejection?.rejecter.roles ?? []).map(({ key, name }) => ({
          key: key ?? '',
          name: name ?? '',
        })),
      },
    },
    eligibleApprovers: approvalFlow.eligibleApprovers.map((approver) => ({
      key: approver.key ?? '',
      name: approver.name,
    })),
    pendingApprovers: approvalFlow.pendingApprovers.map((approver) => ({
      key: approver.key ?? '',
      name: approver.name,
    })),
    currentPendingApproverTiers: approvalFlow.currentTierPendingApprovers.map((approver) => ({
      key: approver.key ?? '',
      name: approver.name,
    })),
  };
};

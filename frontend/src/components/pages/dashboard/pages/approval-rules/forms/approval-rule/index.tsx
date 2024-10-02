import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Input from '@/components/atoms/input';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import InfoTooltip from '@/components/atoms/info-tooltip';
import MultiSelect from '@/components/atoms/multi-select';
import Button from '@/components/atoms/button';
import { ApprovalRule } from '@/types/entity/approval-rule';
import Toggle from '@/components/atoms/toggle';
import Confirmation from '@/components/organisms/confirmation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { Group } from '@/components/organisms/rule-builder/types';
import { ApprovalRulesPageProps } from '../../types';
import RuleBuilderSection from './components/rule-builder-section';

const ApprovalRuleForm = ({
  approvalRules,
  roles,
  rulesCriteria,
  approversCriteria,
  onSubmit,
}: ApprovalRulesPageProps) => {
  const { translate } = useTranslation();

  const router = useCustomRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const initialData = approvalRules.find((approvalRule) => approvalRule.id === id);

  const [data, setData] = useState(
    initialData ??
      ({
        status: 'active',
        requesters: [] as ApprovalRule['requesters'],
        approvers: [
          {
            type: 'group',
            combinator: 'AND',
            rules: [{ type: 'rule', isPlaceholder: true, key: '', operator: '', value: '' }],
          },
        ],
        rules: [
          {
            type: 'group',
            combinator: 'AND',
            rules: [{ type: 'rule', isPlaceholder: true, key: '', operator: '', value: '' }],
          },
        ],
      } as ApprovalRule),
  );

  const [addRule, setAddRule] = useState({ rules: !!initialData, approvers: !!initialData });

  const [isPreviewing, setIsPreviewing] = useState({ rules: !!initialData, approvers: !!initialData });

  useEffect(() => {
    if (!initialData) return;

    setData(initialData);
    setAddRule({ rules: !!initialData, approvers: !!initialData });
    setIsPreviewing({ rules: !!initialData, approvers: !!initialData });
  }, [initialData]);

  const isValidGroup = (group?: Group) => {
    if (!group?.rules?.length) return false;

    for (const rule of group.rules) {
      if (rule.type === 'rule') {
        if (rule.isPlaceholder) return false;
      } else if (!isValidGroup(rule)) return false;
    }

    return true;
  };

  const isInvalid =
    !data.name || !data.requesters?.length || !data.rules?.every(isValidGroup) || !data.approvers?.every(isValidGroup);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = useCallback(async () => {
    setIsProcessing(true);

    await onSubmit(data);

    setIsProcessing(false);
  }, [data, onSubmit]);

  return (
    <div className="pb-12">
      <div className="flex flex-col gap-4">
        <Input
          name="name"
          label={translate('dashboard.rule.name')}
          required
          containerClassName="max-w-[400px]"
          value={data.name ?? ''}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <Input
          name="description"
          label={translate('common.description')}
          showOptionalLabel
          containerClassName="max-w-[400px]"
          value={data.description ?? ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <MultiSelect
          label={
            <InfoTooltip content={translate('dashboard.role.requesters.desc')}>
              {translate('dashboard.role.requesters')}
            </InfoTooltip>
          }
          options={roles}
          className="w-full max-w-[400px]"
          value={data.requesters.map((requester) => requester.key)}
          onChange={(value) =>
            setData({
              ...data,
              requesters: roles
                .filter((role) => value.includes(role.value))
                .map(({ name, value }) => ({ key: value, name })),
            })
          }
        />
      </div>

      <div className="mt-12">
        <RuleBuilderSection
          title={`${translate('common.rule')} *`}
          summary={`${translate('common.rule.desc')}`}
          error={
            isPreviewing.rules && !data.rules?.every(isValidGroup) ? translate('dashboard.rules.setup.incomplete') : ''
          }
          criteria={rulesCriteria}
          tiers={data.rules as Group[]}
          addRule={addRule.rules}
          onAddRule={() => setAddRule({ ...addRule, rules: true })}
          isPreviewing={isPreviewing.rules}
          onPreviewStart={() => setIsPreviewing({ ...isPreviewing, rules: true })}
          onPreviewEnd={() => setIsPreviewing({ ...isPreviewing, rules: false })}
          onRuleUpdate={(rule, index) =>
            setData({
              ...data,
              rules: [...(data.rules as Group[]).slice(0, index), rule, ...(data.rules as Group[]).slice(index + 1)],
            })
          }
        />
      </div>
      <div className="mt-12">
        <RuleBuilderSection
          title={`${translate('common.approvers')} *`}
          summary={`${translate('common.approvers.desc')}`}
          translations={{
            addRule: translate('dashboard.add.approver'),
            addSubgroup: translate('dashboard.add.approval.group'),
          }}
          error={
            isPreviewing.approvers && !data.approvers?.every(isValidGroup)
              ? translate('dashboard.tiers.setup.incomplete')
              : ''
          }
          criteria={approversCriteria}
          includeGroupHeader
          singleMode
          tiers={data.approvers as Group[]}
          maxTiers={5}
          allowMultiTier
          onTierAdd={() =>
            setData({
              ...data,
              approvers: [
                ...(data.approvers as Group[]),
                {
                  type: 'group',
                  combinator: 'AND',
                  rules: [{ type: 'rule', isPlaceholder: true, key: '', operator: '', value: '' }],
                },
              ],
            })
          }
          onTierRemove={(index) =>
            setData({
              ...data,
              approvers: [
                ...(data.approvers as Group[]).slice(0, index),
                ...(data.approvers as Group[]).slice(index + 1),
              ],
            })
          }
          addRule={addRule.approvers}
          onAddRule={() => setAddRule({ ...addRule, approvers: true })}
          isPreviewing={isPreviewing.approvers}
          onPreviewStart={() => setIsPreviewing({ ...isPreviewing, approvers: true })}
          onPreviewEnd={() => setIsPreviewing({ ...isPreviewing, approvers: false })}
          onRuleUpdate={(approver, index) =>
            setData({
              ...data,
              approvers: [
                ...(data.approvers ?? []).slice(0, index),
                approver,
                ...(data.approvers ?? []).slice(index + 1),
              ],
            })
          }
        />
      </div>

      <div className="mt-12">
        <Toggle
          label={translate('dashboard.set.rule.as.active')}
          defaultChecked={data.status === 'active'}
          onChange={(checked) => setData({ ...data, status: checked ? 'active' : 'inactive' })}
        />
      </div>

      <div className="mt-12 flex w-full max-w-[412px] gap-3">
        <Confirmation
          className="flex-1"
          onConfirm={async () => router.back()}
          translations={{
            title: translate('common.unsaved.changes'),
            summary: translate('common.unsaved.changes.warning'),
            cancel: translate('common.cancel'),
            confirm: translate('common.leave'),
          }}
        >
          <Button className="w-full" variant="secondary">
            {translate('common.cancel')}
          </Button>
        </Confirmation>

        <div className="flex-1">
          <Button
            className="w-full"
            variant="primary"
            disabled={isInvalid}
            onClick={handleSubmit}
            loading={isProcessing}
          >
            {translate('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalRuleForm;

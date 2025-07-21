import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/atoms/input';
import { useTranslations } from 'use-intl';
import InfoTooltip from '@/components/atoms/info-tooltip';
import MultiSelect from '@/components/atoms/multi-select';
import Button from '@/components/atoms/button';
import { ApprovalRule } from '@/types/entity/approval-rule';
import Toggle from '@/components/atoms/toggle';
import Confirmation from '@/components/organisms/confirmation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { Group } from '@/components/organisms/rule-builder/types';
import InfoBanner from '@/components/molecules/info-banner';
import { ApprovalRulesPageProps } from '../../types';
import RuleBuilderSection from './components/rule-builder-section';

const defaultGroup: Group = {
  type: 'group',
  combinator: 'AND',
  rules: [{ type: 'rule', isPlaceholder: true, key: '', operator: '', value: '' }],
};

const ApprovalRuleForm = ({
  approvalRules,
  viewOnly,
  roles,
  rulesCriteria,
  approversCriteria,
  onSubmit,
}: ApprovalRulesPageProps) => {
  const translate = useTranslations();
  const router = useCustomRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const initialData = approvalRules.find((approvalRule) => approvalRule.id === id);

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ApprovalRule>({
    defaultValues: initialData ?? {
      status: 'active',
      requesters: [],
      approvers: [defaultGroup],
      rules: [defaultGroup],
    },
  });

  const [addRule, setAddRule] = useState({ rules: !!initialData, approvers: !!initialData });
  const [isPreviewing, setIsPreviewing] = useState({ rules: !!initialData, approvers: !!initialData });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setAddRule({ rules: !!initialData, approvers: !!initialData });
      setIsPreviewing({ rules: !!initialData, approvers: !!initialData });
    }
  }, [initialData, reset]);

  const isValidGroup = (group?: Group) => {
    if (!group?.rules?.length) return false;
    for (const rule of group.rules) {
      if (rule.type === 'rule') {
        if (rule.isPlaceholder) return false;
      } else if (!isValidGroup(rule)) return false;
    }
    return true;
  };

  const data = watch();

  const isInvalid =
    !data.name || !data.requesters?.length || !data.rules?.every(isValidGroup) || !data.approvers?.every(isValidGroup);

  const onFormSubmit = async (values: ApprovalRule) => {
    await onSubmit(values);
  };

  return (
    <div className="pb-12">
      {viewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view-only')}</b> {translate('dashboard.rule-view-only-desc')}
        </InfoBanner>
      )}

      <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
        {id ? translate('dashboard.approval-rule-edit') : translate('dashboard.approval-rule-add')}
      </h1>

      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4" noValidate>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              label={translate('dashboard.rule-name')}
              required
              containerClassName="max-w-[400px]"
              disabled={viewOnly}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              {...field}
              label={translate('common.description')}
              showOptionalLabel
              containerClassName="max-w-[400px]"
              disabled={viewOnly}
            />
          )}
        />

        <Controller
          control={control}
          name="requesters"
          render={({ field: { value, onChange } }) => (
            <MultiSelect
              label={
                <InfoTooltip content={translate('dashboard.role-requesters-desc')}>
                  {translate('dashboard.role-requesters')}
                </InfoTooltip>
              }
              options={roles}
              className="w-full max-w-[400px]"
              value={value?.map((r) => r.key)}
              required
              disabled={viewOnly}
              onChange={(vals) =>
                onChange(
                  roles.filter((role) => vals.includes(role.value)).map(({ name, value }) => ({ key: value, name })),
                )
              }
            />
          )}
        />

        <div className="mt-12">
          <RuleBuilderSection
            title={`${translate('common.rule')} *`}
            summary={`${translate('common.rule-desc')}`}
            error={
              isPreviewing.rules && !data.rules?.every(isValidGroup)
                ? translate('dashboard.rules-setup-incomplete')
                : ''
            }
            viewOnly={viewOnly}
            criteria={rulesCriteria}
            tiers={data.rules as Group[]}
            addRule={addRule.rules}
            onAddRule={() => setAddRule((prev) => ({ ...prev, rules: true }))}
            isPreviewing={isPreviewing.rules}
            onPreviewStart={() => setIsPreviewing((prev) => ({ ...prev, rules: true }))}
            onPreviewEnd={() => setIsPreviewing((prev) => ({ ...prev, rules: false }))}
            onRuleUpdate={(rule, index) => {
              const updatedRules = [...(data.rules ?? [])];
              updatedRules[index] = rule;
              setValue('rules', updatedRules);
            }}
          />
        </div>

        <div className="mt-12">
          <RuleBuilderSection
            title={`${translate('common.approvers')} *`}
            summary={`${translate('common.approvers-desc')}`}
            translations={{
              addRule: translate('dashboard.add-approver'),
              addSubgroup: translate('dashboard.add-approval-group'),
            }}
            error={
              isPreviewing.approvers && !data.approvers?.every(isValidGroup)
                ? translate('dashboard.tiers-setup-incomplete')
                : ''
            }
            viewOnly={viewOnly}
            criteria={approversCriteria}
            includeGroupHeader
            singleMode
            tiers={data.approvers as Group[]}
            maxTiers={5}
            maxDepth={1}
            allowMultiTier
            allowedCombinators={(depth) => (depth === 0 ? ['AND'] : ['OR'])}
            showCombinators={() => false}
            onTierAdd={() => setValue('approvers', [...(data.approvers ?? []), defaultGroup])}
            onTierRemove={(index) => {
              const updated = [...(data.approvers ?? [])];
              updated.splice(index, 1);
              setValue('approvers', updated);
            }}
            addRule={addRule.approvers}
            onAddRule={() => setAddRule((prev) => ({ ...prev, approvers: true }))}
            isPreviewing={isPreviewing.approvers}
            onPreviewStart={() => setIsPreviewing((prev) => ({ ...prev, approvers: true }))}
            onPreviewEnd={() => setIsPreviewing((prev) => ({ ...prev, approvers: false }))}
            onRuleUpdate={(approver, index) => {
              const updated = [...(data.approvers ?? [])];
              updated[index] = approver;
              setValue('approvers', updated);
            }}
          />
        </div>

        <div className="mt-12">
          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <Toggle
                label={translate('dashboard.set-rule-as-active')}
                checked={value === 'active'}
                onChange={(checked) => onChange(checked ? 'active' : 'inactive')}
                disabled={viewOnly}
              />
            )}
          />
        </div>

        <div className="mt-12 flex w-full max-w-[412px] gap-3">
          <Confirmation
            className="flex-1"
            onConfirm={async () => router.back()}
            translations={{
              title: translate('common.unsaved-changes'),
              summary: translate('common.unsaved-changes-warning'),
              cancel: translate('common.cancel'),
              confirm: translate('common.leave'),
            }}
          >
            <Button className="w-full" variant="secondary" type="button">
              {translate('common.cancel')}
            </Button>
          </Confirmation>

          <div className="flex-1">
            <Button
              className="w-full"
              variant="primary"
              disabled={isInvalid || viewOnly}
              type="submit"
              loading={isSubmitting}
            >
              {translate('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApprovalRuleForm;

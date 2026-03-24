import React from 'react';
import Button from '@/components/atoms/button';
import RuleBuilder from '@/components/organisms/rule-builder';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const RuleBuilderSection = ({
  title,
  summary,
  error,
  addRule,
  onAddRule,
  isPreviewing,
  onPreviewStart,
  onPreviewEnd,
  onRuleUpdate,
  criteria,
  tiers = [],
  maxTiers,
  onTierAdd,
  onTierRemove,
  allowMultiTier = false,
  singleMode = false,
  translations = {},
  includeGroupHeader = false,
  allowedCombinators,
  showCombinators,
  maxDepth = Infinity,
}: Props) => {
  const translate = useTranslations();

  return (
    <div>
      <h5 className="text-18 font-medium text-gray-700">{title}</h5>
      <p className="mt-2 text-gray-600">{summary}</p>

      {error && <p className="py-3 text-red-500">{error}</p>}

      <div className="mt-6 flex flex-col">
        {addRule ? (
          <div className="flex flex-col gap-3">
            <div
              className={classnames({
                'relative min-h-[100px] rounded-md border border-gray-300 p-6 pr-32': isPreviewing,
              })}
            >
              <div className={classnames('flex flex-col', { 'gap-3': !isPreviewing })}>
                {React.Children.toArray(
                  tiers.map((tier, index, arr) => (
                    <div
                      className={classnames({
                        'border-b border-gray-300 pb-6': isPreviewing && tiers.length > 1 && index < arr.length - 1,
                        'pt-6': isPreviewing && tiers.length > 1 && index > 0,
                      })}
                    >
                      <RuleBuilder
                        group={tier}
                        translations={{
                          ...translations,
                          groupHeaderLabel: `${translate('dashboard.tier')} ${index + 1}`,
                        }}
                        includeGroupHeader={includeGroupHeader}
                        includeRemoveButton={arr.length > 1}
                        onRemoveGroup={() => onTierRemove?.(index)}
                        singleMode={singleMode}
                        isPreview={isPreviewing}
                        criteria={criteria}
                        onRuleUpdate={(rule) => onRuleUpdate(rule, index)}
                        allowedCombinators={allowedCombinators}
                        showCombinators={showCombinators}
                        maxDepth={maxDepth}
                      />
                    </div>
                  )),
                )}
              </div>

              {isPreviewing && (
                <div className="absolute right-6 top-6">
                  <Button variant="secondary" onClick={() => onPreviewEnd()}>
                    {translate('common.edit')}
                  </Button>
                </div>
              )}
            </div>

            {allowMultiTier && !isPreviewing && (typeof maxTiers === 'undefined' || tiers.length < maxTiers) && (
              <Button variant="secondary" className="self-end" size="m" onClick={onTierAdd}>
                {translate('dashboard.add-approval-tier')}
              </Button>
            )}

            {!isPreviewing && (
              <Button className="w-fit min-w-[140px]" size="m" onClick={() => onPreviewStart()}>
                {translate('common.preview')}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="h-[40px] grow rounded-md border border-gray-300"></div>
            <Button className="min-w-[100px]" onClick={onAddRule}>
              {translate('common.add')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleBuilderSection;

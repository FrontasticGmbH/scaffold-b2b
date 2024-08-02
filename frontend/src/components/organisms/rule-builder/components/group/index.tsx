import React, { useCallback } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { TrashIcon as RemoveIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { GroupProps } from './types';
import Rule from '../rule';
import { Group as GroupType, Rule as RuleType } from '../../types';
import PlaceholderRule from '../placeholder-rule';

const Group = ({
  group,
  singleMode,
  translations,
  includeGroupHeader,
  includeRemoveButton,
  onRemoveGroup,
  criteria,
  onUpdate,
  onRemove,
}: GroupProps) => {
  const { translate } = useTranslation();

  const combinators = [{ key: 'AND' }, { key: 'OR' }] as const;

  const getRuleComponent = useCallback(
    (rule: RuleType | GroupType, index: number) => {
      const handleUpdate = (updatedRule: RuleType | GroupType) =>
        onUpdate({
          ...group,
          rules: [...group.rules.slice(0, index), updatedRule, ...group.rules.slice(index + 1)],
        });

      const handleRemove = () => {
        if (group.rules.length === 1) return onRemove();

        return onUpdate({ ...group, rules: [...group.rules.slice(0, index), ...group.rules.slice(index + 1)] });
      };

      switch (rule.type) {
        case 'group':
          return (
            <Group
              group={rule}
              translations={translations}
              singleMode={singleMode}
              criteria={criteria}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          );
        case 'rule':
          if (rule.isPlaceholder) {
            return (
              <PlaceholderRule
                rule={rule}
                translations={translations}
                singleMode={singleMode}
                criteria={criteria}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            );
          }
          return (
            <Rule
              rule={rule}
              singleMode={singleMode}
              criteria={criteria}
              addButtonIsDisabled={index < group.rules.length - 1}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onAddNew={() =>
                onUpdate({
                  ...group,
                  rules: [...group.rules, { type: 'rule', isPlaceholder: true, key: '', operator: '', value: '' }],
                })
              }
            />
          );
      }
    },
    [criteria, group, onUpdate, onRemove, singleMode, translations],
  );

  return (
    <div className="rounded-lg border border-gray-300 p-6">
      {includeGroupHeader && (
        <div className="flex items-center justify-between pb-6">
          <span className="font-medium text-gray-700">{translations?.groupHeaderLabel ?? ''}</span>

          {includeRemoveButton && (
            <div className="flex w-fit cursor-pointer items-center gap-2 text-14 text-gray-600" onClick={onRemoveGroup}>
              <span>{translate('common.remove')}</span>
              <RemoveIcon width={24} height={24} />
            </div>
          )}
        </div>
      )}
      <div className="grid w-[100px] grid-cols-2 gap-px">
        {combinators.map((combinator, index, arr) => (
          <div
            className={classnames('cursor-pointer py-3 text-center text-14 font-medium outline outline-1', {
              'bg-primary text-white outline-primary': combinator.key === group.combinator,
              'bg-white text-gray-500 outline-gray-300 transition hover:bg-gray-50':
                combinator.key !== group.combinator,
              'rounded-l-md': index === 0,
              'rounded-r-md': index === arr.length - 1,
            })}
            key={combinator.key}
            onClick={() => onUpdate({ ...group, combinator: combinator.key })}
          >
            {combinator.key}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-4">
        {React.Children.toArray(
          group.rules.map((rule, index, arr) => (
            <>
              {getRuleComponent(rule, index)}

              {index < arr.length - 1 && (
                <div className="flex items-center gap-3">
                  <span className="block shrink-0 text-14 font-medium text-gray-600">{group.combinator}</span>
                  <div className="h-px flex-1 bg-neutral-400" />
                </div>
              )}
            </>
          )),
        )}
      </div>
    </div>
  );
};

export default Group;

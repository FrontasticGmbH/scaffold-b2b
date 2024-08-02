import React, { useCallback, useMemo } from 'react';
import useControllableState from '@/hooks/useControllableState';
import { Group, RuleBuilderProps } from './types';
import GroupRule from './components/group';
import RulePreview from './components/rule-preview';

const RuleBuilder = ({
  group,
  singleMode,
  translations,
  includeGroupHeader,
  includeRemoveButton,
  onRemoveGroup,
  criteria,
  isPreview,
  onRuleUpdate,
  onReset,
}: RuleBuilderProps) => {
  const initialState = useMemo<Group>(
    () => ({
      type: 'group',
      combinator: 'AND',
      rules: [{ type: 'rule', isPlaceholder: true, key: '', operator: '', value: '' }],
    }),
    [],
  );

  const [rule, setRule] = useControllableState<Group>(group, initialState);

  const onUpdate = useCallback(
    (updatedRole: Group) => {
      setRule(updatedRole);
      onRuleUpdate?.(updatedRole);
    },
    [onRuleUpdate, setRule],
  );

  const onRemove = useCallback(() => {
    setRule(initialState);
    onReset?.();
  }, [initialState, onReset, setRule]);

  if (isPreview)
    return (
      <RulePreview group={rule} criteria={criteria} label={includeGroupHeader ? translations?.groupHeaderLabel : ''} />
    );

  return (
    <GroupRule
      group={rule}
      translations={translations}
      includeGroupHeader={includeGroupHeader}
      includeRemoveButton={includeRemoveButton}
      onRemoveGroup={onRemoveGroup}
      singleMode={singleMode}
      criteria={criteria}
      onUpdate={onUpdate}
      onRemove={onRemove}
    />
  );
};

export default RuleBuilder;

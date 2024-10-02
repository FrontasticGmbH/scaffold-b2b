import React, { useCallback } from 'react';
import { RulePreviewProps } from './types';
import { Criteria, EnumCriteria, Group, Rule } from '../../types';

const RulePreview = ({ group, label, criteria, renderRule }: RulePreviewProps) => {
  const constructPreview = useCallback(
    (rule: Rule | Group, criteria: Criteria[]) => {
      if (rule.type === 'rule') {
        const ruleCriteria = criteria.find((c) => c.key === rule.key);

        const key = rule.key;
        const name = ruleCriteria?.name ?? key;
        const opName = ruleCriteria?.operators?.find((op) => op.value === rule.operator)?.name ?? rule.operator;
        const valName = (ruleCriteria as EnumCriteria)?.values?.find((v) => v.value === rule.value)?.name ?? rule.value;

        if (renderRule) return renderRule({ key, name, opName, valName });

        return (
          <span className="border border-gray-300 px-2 py-1 text-gray-600">
            {name} {opName} {valName}
          </span>
        );
      }

      const res = [];

      for (let i = 0; i < rule.rules.length; ++i) {
        const formNestedParentheses =
          rule.rules[i].type === 'group' &&
          (rule.rules[i] as Group).rules.length > 1 &&
          (rule.rules[i] as Group).combinator !== rule.combinator;

        if (formNestedParentheses) res.push(<span className="text-gray-600">(</span>);

        res.push(
          <div className="inline-flex flex-wrap items-center gap-3">{constructPreview(rule.rules[i], criteria)}</div>,
        );

        if (formNestedParentheses) res.push(<span className="text-gray-600">)</span>);

        if (i < rule.rules.length - 1) res.push(<span>{rule.combinator.toLowerCase()}</span>);
      }

      return React.Children.toArray(res);
    },
    [renderRule],
  );

  return (
    <div className="flex items-start gap-5">
      {label && <div className="rounded-lg bg-neutral-200 px-6 py-1 font-medium text-gray-700">{label}</div>}
      <div className="flex flex-wrap items-center gap-3">{constructPreview(group, criteria)}</div>
    </div>
  );
};

export default RulePreview;

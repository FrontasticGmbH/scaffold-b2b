import {
  ApprovalRule,
  ApproverConjunction,
  ApproverDisjunction,
  ApproverHierarchy,
  AssociateRole,
} from '@shared/types/business-unit';
import { ApprovalRule as EntityApprovalRule } from '@/types/entity/approval-rule';
import { Group, Rule } from '@/components/organisms/rule-builder/types';
import { approvalRulesConfig } from '@/lib/tastics/approval-rules/config/approval-rules';

export const mapCoCoApproversTiers = (approvers: EntityApprovalRule['approvers']): ApproverConjunction[] => {
  if (!approvers) return [];

  const _mapApproverHierarchy = (rule: Group | Rule): ApproverDisjunction => {
    if (rule.type === 'rule') {
      return {
        or: [
          {
            key: rule.key,
          },
        ],
      };
    }

    return {
      or: rule.rules.filter((rule) => rule.type === 'rule').map((subRule) => ({ key: (subRule as Rule).key })),
    };
  };

  return approvers.map((group) => group.rules.map(_mapApproverHierarchy)).map((group) => ({ and: group }));
};

export const mapCoCoRulesPredicate = (rules: EntityApprovalRule['rules']): string => {
  if (!rules) return '';

  const _mapRulePredicate = (rule: Group | Rule): string => {
    if (rule.type === 'rule') return approvalRulesConfig[rule.key].constructPredicateFromRule(rule);

    const res = [];

    for (let i = 0; i < rule.rules.length; ++i) {
      const formNestedParentheses =
        rule.rules[i].type === 'group' &&
        (rule.rules[i] as Group).rules.length > 1 &&
        (rule.rules[i] as Group).combinator !== rule.combinator;

      if (formNestedParentheses) res.push('(');

      res.push(_mapRulePredicate(rule.rules[i]));

      if (formNestedParentheses) res.push(')');

      if (i < rule.rules.length - 1) res.push(rule.combinator.toLowerCase());
    }

    return res.join(' ');
  };

  return _mapRulePredicate(rules[0]);
};

export const mapCoCoApprovalRule = (approvalRule: EntityApprovalRule): ApprovalRule => {
  return {
    name: approvalRule.name,
    description: approvalRule.description,
    requesters: approvalRule.requesters,
    approvalRuleStatus: approvalRule.status === 'active' ? 'Active' : 'Inactive',
    approvers: { tiers: mapCoCoApproversTiers(approvalRule.approvers) },
    predicate: mapCoCoRulesPredicate(approvalRule.rules),
  };
};

export const mapRulesPredicate = (predicate: string): Group[] => {
  const _mapPredicate = (predicate: string): Group => {
    const rules = [] as Array<Group | Rule>;

    const tokens = predicate.split(' ');

    let combinator: Group['combinator'] = 'AND';

    const stack = [] as string[];

    const _buildRuleFromStack = () => {
      const [value, operator, key] = [stack.pop(), stack.pop(), stack.pop()] as [string, string, string];

      rules.push({
        type: 'rule',
        ...approvalRulesConfig[key].constructRuleFromPredicate(`${key} ${operator} ${value.replace(/\"/g, '')}`),
      });
    };

    let i = 0;

    while (i < tokens.length) {
      let j = i + 1;

      if (tokens[i] === '(') {
        const subPredicate = [];

        let stack = 0;

        while (tokens[j] !== ')' || stack > 0) {
          if (tokens[j] === '(') ++stack;
          else if (tokens[j] === ')') --stack;
          subPredicate.push(tokens[j++]);
        }

        ++j;
        rules.push(_mapPredicate(subPredicate.join(' ')));
      } else if (tokens[i] === 'and' || tokens[i] === 'or') {
        combinator = tokens[i] === 'and' ? 'AND' : 'OR';
        _buildRuleFromStack();
      } else {
        stack.push(tokens[i]);
      }
      i = j;
    }

    if (stack.length > 0) {
      _buildRuleFromStack();
    }

    return { type: 'group', combinator, rules };
  };

  return [_mapPredicate(predicate)];
};

export const mapApproversTiers = (approversHierarchy: ApproverHierarchy): Group[] => {
  return approversHierarchy.tiers
    .map((tier) => tier.and)
    .map((conjunction) => ({
      type: 'group',
      combinator: 'AND',
      rules: conjunction.map((disjunction) => {
        const _mapRule = (role: AssociateRole) => ({
          type: 'rule',
          isPlaceholder: false,
          key: role.key as string,
          operator: '',
          value: '',
        });

        if (disjunction.or.length === 1) return _mapRule(disjunction.or[0]);

        return {
          type: 'group',
          combinator: 'OR',
          rules: disjunction.or.map((role) => _mapRule(role)),
        };
      }),
    })) as Group[];
};

export const mapApprovalRule = (approvalRule: ApprovalRule): EntityApprovalRule => {
  return {
    id: approvalRule.approvalRuleId ?? approvalRule.key ?? '',
    name: approvalRule.name,
    description: approvalRule.description,
    requesters: approvalRule.requesters.map(({ key, name }) => ({ key: key ?? '', name: name ?? key ?? '' })),
    status: (approvalRule.approvalRuleStatus ?? 'Inactive').toLowerCase() as EntityApprovalRule['status'],
    rules: mapRulesPredicate(approvalRule.predicate),
    approvers: mapApproversTiers(approvalRule.approvers),
  };
};

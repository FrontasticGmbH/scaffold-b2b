import { Rule, Criteria } from '@/components/organisms/rule-builder/types';
import { i18nConfig } from '@/project.config';

interface ApprovalRuleConfig {
  type: Criteria['type']; //Types supported in rule builder currently
  name: string; //Display name in rule builder (is translated)
  operators: Array<{ name: string; value: string }>; //Operators available to be used by that rule (name is translated)
  values?: Array<{ name: string; value: string }>; //Possible values to choose from in case of enum rule (name is translated)
  constructPredicateFromRule(rule: Rule): string; //Expected to return a valid CoCo predicate from given rule
  constructRuleFromPredicate(predicate: string): Pick<Rule, 'key' | 'operator' | 'value'>; //Expected to return a valid rule from given CoCo predicate
}

//Names and operator & value names will be translated as mentioned above
export const approvalRulesConfig = {
  'totalPrice.centAmount': {
    type: 'text',
    name: 'cart.cart.amount',
    operators: [
      { name: 'common.is.equal', value: '=' },
      { name: 'common.is.more.than', value: '>' },
      { name: 'common.is.more.than.or.equal', value: '>=' },
      { name: 'common.is.less.than', value: '<' },
      { name: 'common.is.less.than.or.equal', value: '<=' },
    ],
    constructPredicateFromRule(rule) {
      return `${rule.key} ${rule.operator} ${parseInt(rule.value) * 100}`;
    },
    constructRuleFromPredicate(predicate: string) {
      const [key, operator, value] = predicate.split(' ');

      return {
        key,
        operator,
        value: Math.floor(parseInt(value) / 100).toString(),
      };
    },
  },
  currency: {
    type: 'enum',
    name: 'common.currency',
    operators: [
      { name: 'common.is', value: 'is' },
      { name: 'common.is.not', value: 'is_not' },
    ],
    values: [
      { name: 'USD', value: 'USD' },
      { name: 'EUR', value: 'EUR' },
    ],
    constructPredicateFromRule(rule) {
      return `${rule.key} ${rule.operator === 'is' ? '=' : '!='} "${rule.value}"`;
    },
    constructRuleFromPredicate(predicate) {
      const [key, operator, value] = predicate.split(' ');

      return {
        key,
        operator: operator === '=' ? 'is' : 'is_not',
        value,
      };
    },
  },
  country: {
    type: 'enum',
    name: 'common.country',
    operators: [
      { name: 'common.is', value: 'is' },
      { name: 'common.is.not', value: 'is_not' },
    ],
    values: i18nConfig.countries.map(({ countryCode, countryName }) => ({ name: countryName, value: countryCode })),
    constructPredicateFromRule(rule) {
      return `${rule.key} ${rule.operator === 'is' ? '=' : '!='} "${rule.value}"`;
    },
    constructRuleFromPredicate(predicate) {
      const [key, operator, value] = predicate.split(' ');

      return {
        key,
        operator: operator === '=' ? 'is' : 'is_not',
        value,
      };
    },
  },
} as Record<string, ApprovalRuleConfig>;

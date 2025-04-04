import { Combinator, Criteria, Group, Rule, Translations } from '../../types';

export interface PlaceholderRuleProps {
  translations?: Translations;
  singleMode?: boolean;
  disableAddingSubgroup?: boolean;
  rule: Rule;
  criteria: Criteria[];
  defaultCombinator?: Combinator;
  onUpdate: (updatedRule: Rule | Group) => void;
  onRemove: () => void;
}

import { Criteria, Group, Rule, Translations } from '../../types';

export interface PlaceholderRuleProps {
  translations?: Translations;
  singleMode?: boolean;
  rule: Rule;
  criteria: Criteria[];
  onUpdate: (updatedRule: Rule | Group) => void;
  onRemove: () => void;
}

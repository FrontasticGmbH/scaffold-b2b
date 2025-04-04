import { Criteria, Rule } from '../../types';

export interface RuleProps {
  singleMode?: boolean;
  rule: Rule;
  criteria: Criteria[];
  addButtonIsDisabled?: boolean;
  deleteButtonIsDisabled?: boolean;
  onUpdate: (updatedRule: Rule) => void;
  onRemove: () => void;
  onAddNew: () => void;
}

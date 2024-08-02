import { Option } from '@/components/atoms/select/types';

export type Combinator = 'AND' | 'OR';

export interface Rule {
  type: 'rule';
  isPlaceholder?: boolean;
  key: string;
  operator: string;
  value: string;
}

export interface Group {
  type: 'group';
  combinator: Combinator;
  rules: Array<Rule | Group>;
}

export interface BaseCriteria {
  key: string;
  name: string;
  operators: Option[];
}

export interface TextCriteria extends BaseCriteria {
  type: 'text';
}

export interface EnumCriteria extends BaseCriteria {
  type: 'enum';
  values: Option[];
}

export type Criteria = TextCriteria | EnumCriteria;

export interface Translations {
  addRule?: string;
  addSubgroup?: string;
  groupHeaderLabel?: string;
}

export interface RuleBuilderProps {
  group?: Group;
  translations?: Translations;
  singleMode?: boolean;
  includeGroupHeader?: boolean;
  includeRemoveButton?: boolean;
  onRemoveGroup?: () => void;
  isPreview?: boolean;
  criteria: Criteria[];
  onRuleUpdate?: (rule: Group) => void;
  onReset?: () => void;
}

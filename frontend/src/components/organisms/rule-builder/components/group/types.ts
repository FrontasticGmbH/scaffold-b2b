import { Criteria, Group, Translations } from '../../types';

export interface GroupProps {
  depth?: number;
  maxDepth?: number;
  translations?: Translations;
  includeGroupHeader?: boolean;
  includeRemoveButton?: boolean;
  onRemoveGroup?: () => void;
  allowedCombinators: (depth: number) => ['AND'] | ['OR'] | ['AND', 'OR'];
  showCombinators: (depth: number) => boolean;
  singleMode?: boolean;
  group: Group;
  criteria: Criteria[];
  onUpdate: (updatedRule: Group) => void;
  onRemove: () => void;
}

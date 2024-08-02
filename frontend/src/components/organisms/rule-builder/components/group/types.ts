import { Criteria, Group, Translations } from '../../types';

export interface GroupProps {
  translations?: Translations;
  includeGroupHeader?: boolean;
  includeRemoveButton?: boolean;
  onRemoveGroup?: () => void;
  singleMode?: boolean;
  group: Group;
  criteria: Criteria[];
  onUpdate: (updatedRule: Group) => void;
  onRemove: () => void;
}

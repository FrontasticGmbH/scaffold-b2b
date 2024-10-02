import { Criteria, Group } from '../../types';

export interface RulePreviewProps {
  group: Group;
  label?: string;
  criteria: Criteria[];
  renderRule?: (params: { key: string; name: string; opName: string; valName: string }) => React.ReactNode;
}

import { Criteria, Group } from '@/components/organisms/rule-builder/types';

export interface Props {
  title: string;
  summary: string;
  error?: string;
  translations?: {
    addRule?: string;
    addSubgroup?: string;
    groupHeaderLabel?: string;
  };
  includeGroupHeader?: boolean;
  addRule: boolean;
  onAddRule: () => void;
  singleMode?: boolean;
  tiers: Group[];
  maxTiers?: number;
  allowMultiTier?: boolean;
  onTierAdd?: () => void;
  onTierRemove?: (index: number) => void;
  isPreviewing: boolean;
  onPreviewStart: () => void;
  onPreviewEnd: () => void;
  onRuleUpdate: (rule: Group, index: number) => void;
  criteria: Criteria[];
}

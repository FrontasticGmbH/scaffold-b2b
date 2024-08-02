import { Group } from '@/components/organisms/rule-builder/types';

export interface Requester {
  key: string;
  name: string;
}

export interface ApprovalRule {
  id: string;
  name: string;
  description?: string;
  requesters: Requester[];
  rules?: Array<Group>;
  approvers?: Array<Group>;
  status: 'active' | 'inactive';
}

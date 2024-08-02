import React from 'react';
import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { ApprovalFlow } from '@shared/types/business-unit';
import { TasticProps } from '../types';

const ApprovalFlowClientWrapper = dynamic(() => import('./components/approval-flows-client-wrapper'));

const ApprovalFlowDetailsTastic = (props: TasticProps<DataSource<ApprovalFlow>>) => {
  return <ApprovalFlowClientWrapper {...props} />;
};

export default ApprovalFlowDetailsTastic;

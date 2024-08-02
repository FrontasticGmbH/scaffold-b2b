'use client';

import dynamic from 'next/dynamic';

const ApprovalFlowsClientWrapper = dynamic(() => import('./components/approval-flows-client-wrapper'));

const ApprovalFlowsTastic = () => {
  return <ApprovalFlowsClientWrapper />;
};

export default ApprovalFlowsTastic;

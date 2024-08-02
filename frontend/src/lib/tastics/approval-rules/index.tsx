'use client';

import dynamic from 'next/dynamic';

const ApprovalRulesClientWrapper = dynamic(() => import('./components/approval-rules-client-wrapper'));

const ApprovalRulesTastic = () => {
  return <ApprovalRulesClientWrapper />;
};

export default ApprovalRulesTastic;

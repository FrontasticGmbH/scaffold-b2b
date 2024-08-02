import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApprovalRulesPageProps } from '@/components/pages/dashboard/pages/approval-rules/types';
import ApprovalRuleForm from '@/components/pages/dashboard/pages/approval-rules/forms/approval-rule';

const useSubPath = (props: ApprovalRulesPageProps) => {
  const searchParams = useSearchParams();

  const subPath = searchParams.get('subPath');

  const ActiveSubPath = useMemo(() => {
    const components = {
      'add-approval-rule': {
        title: 'dashboard.approval.rule.add',
        Component: <ApprovalRuleForm {...props} />,
      },
      'edit-approval-rule': {
        title: 'dashboard.approval.rule.edit',
        Component: <ApprovalRuleForm {...props} />,
      },
    };

    if (!subPath || !Object.keys(components).includes(subPath)) return;

    return components[subPath as keyof typeof components];
  }, [subPath, props]);

  return { subPath, ActiveSubPath };
};

export default useSubPath;

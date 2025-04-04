import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PurchaseListForm from '@/components/pages/dashboard/pages/purchase-lists/forms/purchase-list';
import { PurchaseListsPageProps } from '@/components/pages/dashboard/pages/purchase-lists/types';

const useSubPath = (props: PurchaseListsPageProps) => {
  const searchParams = useSearchParams();

  const subPath = searchParams.get('subPath');

  const ActiveSubPath = useMemo(() => {
    const components = {
      'add-purchase-list': {
        title: 'dashboard.purchase-list-add',
        Component: <PurchaseListForm {...props} />,
      },
    };

    if (!subPath || !Object.keys(components).includes(subPath)) return;

    return components[subPath as keyof typeof components];
  }, [subPath, props]);

  return { subPath, ActiveSubPath };
};

export default useSubPath;

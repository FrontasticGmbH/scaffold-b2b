import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PurchaseListForm from '@/components/pages/dashboard/pages/purchase-lists/forms/purchase-list';
import { PurchaseListsPageProps } from '@/components/pages/dashboard/pages/purchase-lists/types';
import { useTranslations } from 'use-intl';
import Image from '@/components/atoms/Image';

const useSubPath = (props: PurchaseListsPageProps) => {
  const searchParams = useSearchParams();
  const translate = useTranslations();
  const canCreateShoppingLists =
    props.permissions?.CreateMyShoppingLists || props.permissions?.CreateOthersShoppingLists;

  const subPath = searchParams.get('subPath');

  const ActiveSubPath = useMemo(() => {
    const components = {
      'add-purchase-list': {
        title: 'dashboard.purchase-list-add',
        Component: canCreateShoppingLists ? (
          <PurchaseListForm {...props} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded border border-gray-300 p-20">
            <Image
              className="size-48"
              src={props.permissionImage?.media?.file}
              alt={props.permissionImage?.media?.alt ?? ''}
            />
            <p>{translate('dashboard.purchase-list-create-denied')} </p>
          </div>
        ),
      },
    };

    if (!subPath || !Object.keys(components).includes(subPath)) return;

    return components[subPath as keyof typeof components];
  }, [subPath, props, canCreateShoppingLists, translate]);

  return { subPath, ActiveSubPath };
};

export default useSubPath;

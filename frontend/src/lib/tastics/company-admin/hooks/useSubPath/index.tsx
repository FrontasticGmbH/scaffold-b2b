import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import GeneralInfoForm from '@/components/pages/dashboard/pages/company-admin/forms/general-info';
import { CompanyAdminPageProps } from '@/components/pages/dashboard/pages/company-admin/types';
import AddressForm from '@/components/pages/dashboard/pages/company-admin/forms/address';
import AssociateForm from '@/components/pages/dashboard/pages/company-admin/forms/associate';
import BusinessUnitForm from '@/components/pages/dashboard/pages/company-admin/forms/business-unit';

const useSubPath = (props: CompanyAdminPageProps) => {
  const searchParams = useSearchParams();

  const subPath = searchParams.get('subPath');

  const ActiveSubPath = useMemo(() => {
    const components = {
      'edit-general-info': {
        title: 'dashboard.general.info.edit',
        Component: <GeneralInfoForm {...props} />,
      },
      'add-address': {
        title: 'dashboard.address.add',
        Component: <AddressForm {...props} />,
      },
      'edit-address': {
        title: 'dashboard.address.edit',
        Component: <AddressForm {...props} />,
      },
      'add-associate': {
        title: 'dashboard.associate.add',
        Component: <AssociateForm {...props} />,
      },
      'edit-associate': {
        title: 'dashboard.associate.edit',
        Component: <AssociateForm {...props} />,
      },
      'add-business-unit': {
        title: 'dashboard.business.unit.add',
        Component: <BusinessUnitForm {...props} />,
      },
      'edit-business-unit': {
        title: 'dashboard.business.unit.edit',
        Component: <BusinessUnitForm {...props} />,
      },
    };

    if (!subPath || !Object.keys(components).includes(subPath)) return;

    return components[subPath as keyof typeof components];
  }, [subPath, props]);

  return { subPath, ActiveSubPath };
};

export default useSubPath;

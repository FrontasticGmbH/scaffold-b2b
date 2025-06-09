import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddressesPageProps } from '@/components/pages/dashboard/pages/addresses/types';
import AddressForm from '@/components/molecules/address-form';

const useSubPath = (props: AddressesPageProps) => {
  const searchParams = useSearchParams();

  const subPath = searchParams.get('subPath');

  const ActiveSubPath = useMemo(() => {
    const components = {
      'add-address': {
        title: 'dashboard.address-add',
        Component: (
          <AddressForm
            {...({
              ...props,
              addresses: props.addresses,
              onAddAddress: props.onAddAddress,
            } as React.ComponentProps<typeof AddressForm>)}
          />
        ),
      },
      'edit-address': {
        title: 'dashboard.address-edit',
        Component: (
          <AddressForm
            {...({
              ...props,
              addresses: props.addresses,
              onUpdateAddress: props.onUpdateAddress,
            } as React.ComponentProps<typeof AddressForm>)}
          />
        ),
      },
    };

    if (!subPath || !Object.keys(components).includes(subPath)) return;

    return components[subPath as keyof typeof components];
  }, [subPath, props]);

  return { subPath, ActiveSubPath };
};

export default useSubPath;

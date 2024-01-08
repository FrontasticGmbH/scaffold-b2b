'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import AddressesPage from '@/components/pages/dashboard/pages/addresses';
import { AddressesPageProps } from '@/components/pages/dashboard/pages/addresses/types';
import useAccount from '@/lib/hooks/useAccount';
import { mapCoCoAddress } from '@/utils/mappers/map-address';
import countries from '@/static/countries.json';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useSearch from './hooks/useSearch';
import useSubPath from './hooks/useSubPath';

const AddressesTastic = () => {
  const { account } = useAccount();

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { searchedAddresses, handleSearch } = useSearch({ addresses: selectedBusinessUnit?.addresses ?? [] });

  const { addAddress, removeAddress, updateAddress } = useBusinessUnits();

  const addressesProps = {
    addresses: searchedAddresses,
    onSearchAddresses: handleSearch('addresses'),
    onAddAddress: async (address) => {
      if (!selectedBusinessUnit?.key) return false;

      const addressRes = await addAddress({ ...mapCoCoAddress(address), businessUnit: selectedBusinessUnit?.key });
      return !!addressRes.businessUnitId;
    },
    onUpdateAddress: async (address) => {
      if (!selectedBusinessUnit?.key) return false;

      const addressRes = await updateAddress({ ...mapCoCoAddress(address), businessUnit: selectedBusinessUnit?.key });
      return !!addressRes.businessUnitId;
    },
    onDeleteAddress: async (addressId) => {
      if (!selectedBusinessUnit?.key) return false;

      const addressRes = await removeAddress({ addressId, businessUnit: selectedBusinessUnit?.key });
      return !!addressRes.businessUnitId;
    },
    countryOptions: countries.map(({ name, code, states }) => ({
      name,
      value: code,
      states: states.map(({ name, code }) => ({ name, value: code })),
    })),
  } as AddressesPageProps;

  const { ActiveSubPath } = useSubPath(addressesProps);

  return (
    <Dashboard
      title={ActiveSubPath?.title ?? 'common.addresses'}
      href={DashboardLinks.addresses}
      userName={account?.firstName}
    >
      {ActiveSubPath?.Component ?? <AddressesPage {...addressesProps} />}
    </Dashboard>
  );
};

export default AddressesTastic;

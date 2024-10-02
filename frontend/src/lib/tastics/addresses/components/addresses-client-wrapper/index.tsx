'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import AddressesPage from '@/components/pages/dashboard/pages/addresses';
import { AddressesPageProps } from '@/components/pages/dashboard/pages/addresses/types';
import useAccount from '@/lib/hooks/useAccount';
import { mapAddress, mapCoCoAddress } from '@/utils/mappers/map-address';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { mapCountry } from '@/utils/mappers/map-country';
import useSubPath from '../../hooks/useSubPath';
import useSearch from '../../hooks/useSearch';

const AddressesClientWrapper = () => {
  const { projectSettings } = useProjectSettings();

  const { account, isLoading } = useAccount();

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { addAddress, removeAddress, updateAddress, businessUnits } = useBusinessUnits();

  const addresses = (businessUnits.find((bu) => bu.key === selectedBusinessUnit?.key)?.addresses ?? []).map(mapAddress);

  const { searchedAddresses, handleSearch } = useSearch({ addresses });

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const viewOnly = !permissions.UpdateBusinessUnitDetails;

  const addressesProps = {
    addresses: searchedAddresses,
    loading: isLoading || !selectedBusinessUnit?.key,
    onSearchAddresses: handleSearch('addresses'),
    viewOnly,
    onAddAddress: async (address) => {
      if (!selectedBusinessUnit?.key) return false;

      const addressRes = await addAddress({ ...mapCoCoAddress(address), businessUnitKey: selectedBusinessUnit?.key });
      return !!addressRes.businessUnitId;
    },
    onUpdateAddress: async (address) => {
      if (!selectedBusinessUnit?.key) return false;

      const addressRes = await updateAddress({
        ...mapCoCoAddress(address),
        businessUnitKey: selectedBusinessUnit?.key,
      });
      return !!addressRes.businessUnitId;
    },
    onDeleteAddress: async (addressId) => {
      if (!selectedBusinessUnit?.key) return false;

      const addressRes = await removeAddress({ addressId, businessUnitKey: selectedBusinessUnit?.key });
      return !!addressRes.businessUnitId;
    },
    countryOptions: (projectSettings?.countries ?? []).map(mapCountry).map(({ name, code, states }) => ({
      name,
      value: code,
      states: states.map(({ name, code }) => ({ name, value: code })),
    })),
  } as AddressesPageProps;

  const { ActiveSubPath } = useSubPath(addressesProps);

  return (
    <Dashboard title={ActiveSubPath?.title} href={DashboardLinks.addresses} userName={account?.firstName}>
      {ActiveSubPath?.Component ?? <AddressesPage {...addressesProps} />}
    </Dashboard>
  );
};

export default AddressesClientWrapper;

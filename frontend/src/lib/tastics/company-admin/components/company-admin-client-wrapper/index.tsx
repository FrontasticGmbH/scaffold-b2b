'use client';

import React from 'react';
import CompanyAdminPage from '@/components/pages/dashboard/pages/company-admin';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import Dashboard from '@/components/pages/dashboard';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useAccount from '@/lib/hooks/useAccount';
import { mapCoCoAddress } from '@/utils/mappers/map-address';
import { mapBusinessUnit } from '@/utils/mappers/map-business-unit';
import { CompanyAdminPageProps } from '@/components/pages/dashboard/pages/company-admin/types';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { mapCountry } from '@/utils/mappers/map-country';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useSearch from '../../hooks/useSearch';
import useRole from '../../hooks/useRole';
import useStore from '../../hooks/useStore';
import useSubPath from '../../hooks/useSubPath';

const CompanyAdminClientWrapper = () => {
  const { projectSettings } = useProjectSettings();

  const { businessUnits } = useBusinessUnits();
  const { selectedBusinessUnit, setSelectedBusinessUnitKey } = useStoreAndBusinessUnits();

  const {
    addBusinessUnit,
    updateBusinessUnit,
    addAssociate,
    updateAssociate,
    removeAssociate,
    addAddress,
    updateAddress,
    removeAddress,
  } = useBusinessUnits();

  const { selectedStore } = useStore({ activeBusinessUnit: selectedBusinessUnit });

  const { roleOptions } = useRole();

  const { account } = useAccount();

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const addressesAreViewOnly = !permissions.UpdateBusinessUnitDetails;
  const businessUnitsAreViewOnly = !permissions.UpdateBusinessUnitDetails;
  const associatesAreViewOnly = !permissions.UpdateAssociates;

  const { searchedAddresses, searchedAssociates, searchedBusinessUnits, handleSearch } = useSearch({
    addresses: selectedBusinessUnit?.addresses ?? [],
    associates: selectedBusinessUnit?.associates ?? [],
    businessUnits: (businessUnits ?? []).map(mapBusinessUnit),
  });

  const companyAdminProps = {
    companyName: account?.companyName,
    storeName: selectedBusinessUnit?.name ?? selectedBusinessUnit?.key,
    businessUnitOptions: businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' })),
    initialBusinessUnit: selectedBusinessUnit?.key,
    onBusinessUnitChange: setSelectedBusinessUnitKey,
    countryOptions: (projectSettings?.countries ?? []).map(mapCountry).map(({ name, code, states }) => ({
      name,
      value: code,
      states: states.map(({ name, code }) => ({ name, value: code })),
    })),
    roleOptions,
    businessUnitsAreViewOnly,
    associatesAreViewOnly,
    addressesAreViewOnly,
    generalInformation: selectedBusinessUnit
      ? [
          {
            id: selectedBusinessUnit.id ?? '',
            key: selectedBusinessUnit.key ?? '',
            name: selectedBusinessUnit.name ?? '',
            email: selectedBusinessUnit.email ?? '',
          },
        ]
      : [],
    addresses: searchedAddresses,
    onSearchAddresses: handleSearch('addresses'),
    associates: searchedAssociates,
    onSearchAssociates: handleSearch('associates'),
    onAddAssociate: async (associate) => {
      const associateRes = await addAssociate({ ...associate, businessUnitKey: selectedBusinessUnit?.key as string });
      return !!associateRes.businessUnitId;
    },
    onUpdateAssociate: async (associate) => {
      const associateRes = await updateAssociate({
        ...associate,
        businessUnitKey: selectedBusinessUnit?.key as string,
      });
      return !!associateRes.businessUnitId;
    },
    onDeleteAssociate: async (id) => {
      const associate = await removeAssociate({ id, businessUnitKey: selectedBusinessUnit?.key as string });
      return !!associate.businessUnitId;
    },
    businessUnits: searchedBusinessUnits,
    onSearchBusinessUnits: handleSearch('businessUnits'),
    onAddBusinessUnit: async ({ email, name }) => {
      if (!selectedStore || !account?.accountId) return false;

      const businessUnit = await addBusinessUnit({
        account: { accountId: account.accountId, companyName: name, email },
        storeId: selectedStore.id ?? '',
      });
      return !!businessUnit.businessUnitId;
    },
    onUpdateBusinessUnit: async ({ name, email, key }) => {
      const businessUnit = await updateBusinessUnit({
        name: name ?? '',
        contactEmail: email ?? '',
        businessUnitKey: key ?? '',
      });
      return !!businessUnit.businessUnitId;
    },
    onUpdateGeneralInfo: async ({ name, email, key }) => {
      const businessUnit = await updateBusinessUnit({
        name: name ?? '',
        contactEmail: email ?? '',
        businessUnitKey: key ?? '',
      });
      return !!businessUnit.businessUnitId;
    },
    canAddBusinessUnit: !!selectedStore,
    onAddAddress: async (address) => {
      if (!selectedBusinessUnit?.key) return;

      const businessUnit = await addAddress({ ...mapCoCoAddress(address), businessUnitKey: selectedBusinessUnit.key });
      return !!businessUnit.businessUnitId;
    },
    onUpdateAddress: async (address) => {
      if (!selectedBusinessUnit?.key) return;

      const businessUnit = await updateAddress({
        ...mapCoCoAddress(address),
        businessUnitKey: selectedBusinessUnit.key,
      });
      return !!businessUnit.businessUnitId;
    },
    onDeleteAddress: async (id) => {
      if (!selectedBusinessUnit?.key) return;

      const businessUnit = await removeAddress({ addressId: id, businessUnitKey: selectedBusinessUnit.key });
      return !!businessUnit.businessUnitId;
    },
  } as CompanyAdminPageProps;

  const { ActiveSubPath } = useSubPath({ ...companyAdminProps, selectedStore });

  return (
    <Dashboard title={ActiveSubPath?.title} href={DashboardLinks.companyAdmin} userName={account?.firstName}>
      {ActiveSubPath?.Component ?? <CompanyAdminPage {...companyAdminProps} />}
    </Dashboard>
  );
};

export default CompanyAdminClientWrapper;

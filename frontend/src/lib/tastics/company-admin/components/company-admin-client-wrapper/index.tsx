'use client';

import React from 'react';
import CompanyAdminPage from '@/components/pages/dashboard/pages/company-admin';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import Dashboard from '@/components/pages/dashboard';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useAccount from '@/lib/hooks/useAccount';
import { mapAddress, mapCoCoAddress } from '@/utils/mappers/map-address';
import { mapAssociate } from '@/utils/mappers/map-associate';
import { mapBusinessUnit } from '@/utils/mappers/map-business-unit';
import { CompanyAdminPageProps } from '@/components/pages/dashboard/pages/company-admin/types';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { mapCountry } from '@/utils/mappers/map-country';
import useSearch from '../../hooks/useSearch';
import useRole from '../../hooks/useRole';
import useStore from '../../hooks/useStore';
import useBusinessUnit from '../../hooks/useBusinessUnit';
import useSubPath from '../../hooks/useSubPath';

const CompanyAdminClientWrapper = () => {
  const { projectSettings } = useProjectSettings();

  const { activeBusinessUnit, onBusinessUnitSelected, businessUnits } = useBusinessUnit();

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

  const { selectedStore } = useStore({ activeBusinessUnit });

  const { roleOptions } = useRole();

  const { account } = useAccount();

  const { permissions } = useAccountRoles(activeBusinessUnit?.key);

  const addressesAreViewOnly = !permissions.UpdateBusinessUnitDetails;
  const businessUnitsAreViewOnly = !permissions.UpdateBusinessUnitDetails;
  const associatesAreViewOnly = !permissions.UpdateAssociates;

  const { searchedAddresses, searchedAssociates, searchedBusinessUnits, handleSearch } = useSearch({
    addresses: activeBusinessUnit?.addresses ?? [],
    associates: activeBusinessUnit?.associates ?? [],
    businessUnits: businessUnits ?? [],
  });

  const companyAdminProps = {
    companyName: account?.companyName,
    storeName: activeBusinessUnit?.name ?? activeBusinessUnit?.key,
    businessUnitOptions: businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' })),
    initialBusinessUnit: activeBusinessUnit?.key,
    onBusinessUnitChange: onBusinessUnitSelected,
    countryOptions: (projectSettings?.countries ?? []).map(mapCountry).map(({ name, code, states }) => ({
      name,
      value: code,
      states: states.map(({ name, code }) => ({ name, value: code })),
    })),
    roleOptions,
    businessUnitsAreViewOnly,
    associatesAreViewOnly,
    addressesAreViewOnly,
    generalInformation: activeBusinessUnit
      ? [
          {
            id: activeBusinessUnit.businessUnitId ?? '',
            key: activeBusinessUnit.key ?? '',
            name: activeBusinessUnit.name ?? '',
            email: activeBusinessUnit.contactEmail ?? '',
          },
        ]
      : [],
    addresses: searchedAddresses.map(mapAddress),
    onSearchAddresses: handleSearch('addresses'),
    associates: searchedAssociates.map(mapAssociate),
    onSearchAssociates: handleSearch('associates'),
    onAddAssociate: async (associate) => {
      const associateRes = await addAssociate({ ...associate, businessUnitKey: activeBusinessUnit?.key as string });
      return !!associateRes.businessUnitId;
    },
    onUpdateAssociate: async (associate) => {
      const associateRes = await updateAssociate({ ...associate, businessUnitKey: activeBusinessUnit?.key as string });
      return !!associateRes.businessUnitId;
    },
    onDeleteAssociate: async (id) => {
      const associate = await removeAssociate({ id, businessUnitKey: activeBusinessUnit?.key as string });
      return !!associate.businessUnitId;
    },
    businessUnits: searchedBusinessUnits.map(mapBusinessUnit),
    onSearchBusinessUnits: handleSearch('businessUnits'),
    onAddBusinessUnit: async ({ email, name }) => {
      if (!selectedStore || !account?.accountId) return false;

      const businessUnit = await addBusinessUnit({
        account: { accountId: account.accountId, companyName: name, email },
        storeId: selectedStore.storeId ?? '',
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
      if (!activeBusinessUnit.key) return;

      const businessUnit = await addAddress({ ...mapCoCoAddress(address), businessUnitKey: activeBusinessUnit.key });
      return !!businessUnit.businessUnitId;
    },
    onUpdateAddress: async (address) => {
      if (!activeBusinessUnit.key) return;

      const businessUnit = await updateAddress({ ...mapCoCoAddress(address), businessUnitKey: activeBusinessUnit.key });
      return !!businessUnit.businessUnitId;
    },
    onDeleteAddress: async (id) => {
      if (!activeBusinessUnit.key) return;

      const businessUnit = await removeAddress({ addressId: id, businessUnitKey: activeBusinessUnit.key });
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

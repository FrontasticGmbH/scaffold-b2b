'use client';

import React from 'react';
import CompanyAdminPage from '@/components/pages/dashboard/pages/company-admin';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import Dashboard from '@/components/pages/dashboard';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useAccount from '@/lib/hooks/useAccount';
import countries from '@/static/countries.json';
import { mapAddress } from '@/utils/mappers/map-address';
import { mapAssociate } from '@/utils/mappers/map-associate';
import { mapBusinessUnit } from '@/utils/mappers/map-business-unit';
import { CompanyAdminPageProps } from '@/components/pages/dashboard/pages/company-admin/types';
import useSearch from './hooks/useSearch';
import useRole from './hooks/useRole';
import useStore from './hooks/useStore';
import useBusinessUnit from './hooks/useBusinessUnit';
import useSubPath from './hooks/useSubPath';

const CompanyAdminTastic = () => {
  const { activeBusinessUnit, onBusinessUnitSelected, businessUnits } = useBusinessUnit();

  const { addBusinessUnit, updateBusinessUnit, removeBusinessUnit, addAssociate, updateAssociate, removeAssociate } =
    useBusinessUnits();

  const { storeOptions, onStoreSelected, selectedStore } = useStore({ activeBusinessUnit });

  const { roleOptions } = useRole();

  const { account } = useAccount();

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
    storeOptions,
    onStoreChange: onStoreSelected,
    countryOptions: countries.map(({ name, code, states }) => ({
      name,
      value: code,
      states: states.map(({ name, code }) => ({ name, value: code })),
    })),
    roleOptions,
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
      const associateRes = await addAssociate({ ...associate, businessUnit: activeBusinessUnit?.key as string });
      return !!associateRes.businessUnitId;
    },
    onUpdateAssociate: async (associate) => {
      const associateRes = await updateAssociate({ ...associate, businessUnit: activeBusinessUnit?.key as string });
      return !!associateRes.businessUnitId;
    },
    onDeleteAssociate: async (id) => {
      const associate = await removeAssociate({ id, businessUnit: activeBusinessUnit?.key as string });
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
      const businessUnit = await updateBusinessUnit({ name: name ?? '', contactEmail: email ?? '', key: key ?? '' });
      return !!businessUnit.businessUnitId;
    },
    onUpdateGeneralInfo: async ({ name, email, key }) => {
      const businessUnit = await updateBusinessUnit({ name: name ?? '', contactEmail: email ?? '', key: key ?? '' });
      return !!businessUnit.businessUnitId;
    },
    onDeleteBusinessUnit: async (id) => {
      const target = businessUnits.find((businessUnit) => businessUnit.businessUnitId === id);
      const businessUnit = await removeBusinessUnit(target?.key as string);
      return !!businessUnit.businessUnitId;
    },
    canAddBusinessUnit: !!selectedStore,
  } as CompanyAdminPageProps;

  const { ActiveSubPath } = useSubPath({ ...companyAdminProps, selectedStore });

  return (
    <Dashboard
      title={ActiveSubPath?.title ?? 'common.company.admin'}
      href={DashboardLinks.companyAdmin}
      userName={account?.firstName}
    >
      {ActiveSubPath?.Component ?? <CompanyAdminPage {...companyAdminProps} />}
    </Dashboard>
  );
};

export default CompanyAdminTastic;

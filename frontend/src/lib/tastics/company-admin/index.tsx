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

  const { addBusinessUnit, removeBusinessUnit, addAssociate, updateAssociate, removeAssociate } = useBusinessUnits();

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
    storeName: selectedStore?.name,
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
      await addAssociate({ ...associate, businessUnit: activeBusinessUnit?.key as string });
    },
    onUpdateAssociate: async (associate) => {
      await updateAssociate({ ...associate, businessUnit: activeBusinessUnit?.key as string });
    },
    onDeleteAssociate: async (id) => {
      await removeAssociate({ id, businessUnit: activeBusinessUnit?.key as string });
    },
    businessUnits: searchedBusinessUnits.map(mapBusinessUnit),
    onSearchBusinessUnits: handleSearch('businessUnits'),
    onAddBusinessUnit: async ({ email, name }) => {
      if (!selectedStore) return;
      await addBusinessUnit({ account: { ...account, companyName: name, email }, store: selectedStore });
    },
    onDeleteBusinessUnit: async (id) => {
      const target = businessUnits.find((businessUnit) => businessUnit.businessUnitId === id);
      if (target) await removeBusinessUnit(target.key as string);
    },
    canAddBusinessUnit: !!selectedStore,
  } as CompanyAdminPageProps;

  const { ActiveSubPath } = useSubPath(companyAdminProps);

  return (
    <Dashboard title={ActiveSubPath?.title ?? 'common.company.admin'} href={DashboardLinks.companyAdmin}>
      {ActiveSubPath?.Component ?? <CompanyAdminPage {...companyAdminProps} />}
    </Dashboard>
  );
};

export default CompanyAdminTastic;

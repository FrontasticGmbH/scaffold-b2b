import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from '@/components/atoms/select';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Tabs from '@/components/organisms/tabs';
import InfoBanner from '@/components/molecules/info-banner';
import { CompanyAdminPageProps } from './types';
import GeneralInformationTable from './components/general-information-table';
import AddressesTable from './components/addresses-table';
import SearchPanel from '../../components/search-panel';
import AssociatesTable from './components/associates-table';
import BusinessUnitsTable from './components/business-units-table';

const CompanyAdminPage = ({
  businessUnitOptions,
  onBusinessUnitChange,
  initialBusinessUnit,
  generalInformation,
  addresses,
  associates,
  businessUnits,
  onDeleteAssociate,
  onDeleteAddress,
  canAddBusinessUnit,
  onSearchAddresses,
  onSearchAssociates,
  onSearchBusinessUnits,
  addressesAreViewOnly = false,
  businessUnitsAreViewOnly = false,
  associatesAreViewOnly = false,
}: CompanyAdminPageProps) => {
  const { translate } = useTranslation();

  const params = useSearchParams();

  const [selectedTab, setSelectedTab] = useState(params.get('tab'));

  const router = useRouter();

  return (
    <div className="hidden lg:block">
      {selectedTab === '1' && addressesAreViewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b> {translate('dashboard.addresses.view.only.desc')}
        </InfoBanner>
      )}

      {selectedTab === '2' && associatesAreViewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b> {translate('dashboard.associates.view.only.desc')}
        </InfoBanner>
      )}

      {selectedTab === '3' && businessUnitsAreViewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b> {translate('dashboard.business.units.view.only.desc')}
        </InfoBanner>
      )}

      <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
        {translate('common.company.admin')}
      </h1>

      <div className="flex gap-3">
        <Select
          className="w-[280px]"
          label={translate('common.business.unit')}
          placeholder={translate('common.select')}
          enableSearch
          options={businessUnitOptions}
          defaultValue={initialBusinessUnit}
          onChange={onBusinessUnitChange}
        />
      </div>

      <div className="mt-11">
        <Tabs
          defaultActiveIndex={selectedTab ? +selectedTab : 0}
          onActiveIndexChange={(index) => {
            setSelectedTab(index.toString());
            router.replace(`?tab=${index}`);
          }}
        >
          <Tabs.TabList>
            <Tabs.Tab>{translate('common.general')}</Tabs.Tab>
            <Tabs.Tab>{translate('common.addresses')}</Tabs.Tab>
            <Tabs.Tab>{translate('common.associates')}</Tabs.Tab>
            <Tabs.Tab>{translate('common.business.units')}</Tabs.Tab>
          </Tabs.TabList>
          <Tabs.Panels>
            <Tabs.Panel>
              <GeneralInformationTable generalInformation={generalInformation} />
            </Tabs.Panel>
            <Tabs.Panel>
              <SearchPanel
                translations={{ button: translate('dashboard.address.add') }}
                buttonLink="?subPath=add-address"
                buttonDisabled={addressesAreViewOnly}
                onSearchChange={onSearchAddresses}
                isEmpty={!addresses.length}
                entity={translate('common.addresses').toLowerCase()}
              >
                <AddressesTable addresses={addresses} onDeleteAddress={onDeleteAddress} />
              </SearchPanel>
            </Tabs.Panel>
            <Tabs.Panel>
              <SearchPanel
                translations={{ button: translate('dashboard.associate.add') }}
                buttonLink="?subPath=add-associate"
                buttonDisabled={associatesAreViewOnly}
                onSearchChange={onSearchAssociates}
                isEmpty={!associates.length}
                entity={translate('common.associates').toLowerCase()}
              >
                <AssociatesTable
                  associates={associates}
                  onDeleteAssociate={onDeleteAssociate}
                  associatesAreViewOnly={associatesAreViewOnly}
                />
              </SearchPanel>
            </Tabs.Panel>
            <Tabs.Panel>
              <SearchPanel
                translations={{ button: translate('dashboard.business.unit.add') }}
                buttonLink="?subPath=add-business-unit"
                buttonDisabled={!canAddBusinessUnit || businessUnitsAreViewOnly}
                onSearchChange={onSearchBusinessUnits}
                isEmpty={!businessUnits.length}
                entity={translate('common.business.units').toLowerCase()}
              >
                <BusinessUnitsTable businessUnits={businessUnits} businessUnitsAreViewOnly={businessUnitsAreViewOnly} />
              </SearchPanel>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyAdminPage;

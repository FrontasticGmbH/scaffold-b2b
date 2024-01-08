import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from '@/components/atoms/select';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Tabs from '@/components/organisms/tabs';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
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
  onDeleteBusinessUnit,
  onDeleteAddress,
  canAddBusinessUnit,
  onSearchAddresses,
  onSearchAssociates,
  onSearchBusinessUnits,
}: CompanyAdminPageProps) => {
  const { translate } = useTranslation();

  const [isLargerThanDesktop] = useMediaQuery(desktop);

  const params = useSearchParams();

  const defaultTab = params.get('tab');

  const router = useRouter();

  if (!isLargerThanDesktop) return <></>;

  return (
    <div>
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
          defaultActiveIndex={defaultTab ? +defaultTab : 0}
          onActiveIndexChange={(index) => router.replace(`?tab=${index}`)}
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
                onSearchChange={onSearchAssociates}
                isEmpty={!associates.length}
                entity={translate('common.associates').toLowerCase()}
              >
                <AssociatesTable associates={associates} onDeleteAssociate={onDeleteAssociate} />
              </SearchPanel>
            </Tabs.Panel>
            <Tabs.Panel>
              <SearchPanel
                translations={{ button: translate('dashboard.business.unit.add') }}
                buttonLink="?subPath=add-business-unit"
                buttonDisabled={!canAddBusinessUnit}
                onSearchChange={onSearchBusinessUnits}
                isEmpty={!businessUnits.length}
                entity={translate('common.business.units').toLowerCase()}
              >
                <BusinessUnitsTable businessUnits={businessUnits} onDeleteBusinessUnit={onDeleteBusinessUnit} />
              </SearchPanel>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyAdminPage;

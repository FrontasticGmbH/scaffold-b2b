import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import InfoBanner from '@/components/molecules/info-banner';
import SearchPanel from '../../components/search-panel';
import AddressesTable from '../company-admin/components/addresses-table';
import { AddressesPageProps } from './types';

const AddressesPage = ({ addresses, loading, onDeleteAddress, onSearchAddresses, viewOnly }: AddressesPageProps) => {
  const { translate } = useTranslation();

  return (
    <div>
      {viewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b> {translate('dashboard.addresses.view.only.desc')}
        </InfoBanner>
      )}

      <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
        {translate('common.addresses')}
      </h1>

      <SearchPanel
        translations={{ button: translate('dashboard.address.add') }}
        buttonLink={`?subPath=add-address`}
        buttonDisabled={viewOnly}
        onSearchChange={onSearchAddresses}
        isEmpty={!addresses.length}
        isLoading={loading}
        entity={translate('common.addresses')}
      >
        <AddressesTable onDeleteAddress={onDeleteAddress} addresses={addresses} />
      </SearchPanel>
    </div>
  );
};

export default AddressesPage;

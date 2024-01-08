import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchPanel from '../../components/search-panel';
import AddressesTable from '../company-admin/components/addresses-table';
import { AddressesPageProps } from './types';

const AddressesPage = ({ addresses, onDeleteAddress, onSearchAddresses }: AddressesPageProps) => {
  const { translate } = useTranslation();

  return (
    <SearchPanel
      translations={{ button: translate('dashboard.address.add') }}
      buttonLink={`?subPath=add-address`}
      onSearchChange={onSearchAddresses}
      isEmpty={!addresses.length}
      entity={translate('common.addresses')}
    >
      <AddressesTable onDeleteAddress={onDeleteAddress} addresses={addresses} />
    </SearchPanel>
  );
};

export default AddressesPage;

import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchPanel from '../../components/search-panel';
import AddressesTable from '../company-admin/components/addresses-table';
import { AddressesPageProps } from './types';

const AddressesPage = ({ onDeleteAccountAddress, accountAddresses, onSearchAccountAddresses }: AddressesPageProps) => {
  const { translate } = useTranslation();

  return (
    <SearchPanel
      translations={{ button: translate('dashboard.address.add') }}
      buttonLink={`?subPath=add-address`}
      onSearchChange={onSearchAccountAddresses}
      isEmpty={!accountAddresses.length}
      entity={translate('common.addresses')}
    >
      <AddressesTable onDeleteAddress={onDeleteAccountAddress} addresses={accountAddresses} />
    </SearchPanel>
  );
};

export default AddressesPage;

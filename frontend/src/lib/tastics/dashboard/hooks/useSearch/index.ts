import { useCallback, useState } from 'react';
import { Address } from '@shared/types/account/Address';
import { Associate } from '@shared/types/business-unit/Associate';
import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';
import { Props } from './types';

const useSearch = ({ addresses, accountAddresses, associates, businessUnits }: Props) => {
  const [search, setSearch] = useState({ addresses: '', accountAddresses: '', associates: '', businessUnits: '' });

  const handleSearch = useCallback(
    (key: keyof typeof search) => {
      return (val: string) => setSearch({ ...search, [key]: val });
    },
    [search],
  );

  const searchAddresses = (
    { firstName, lastName, streetName, streetNumber, city, country, state }: Address,
    searchValue: string,
  ) => {
    return [firstName, lastName, streetName, streetNumber, city, country, state].some(
      (e) => e && e.includes(searchValue),
    );
  };

  const searchAssociates = ({ firstName, lastName, email }: Associate) => {
    return [firstName, lastName, email].some((e) => e && e.includes(search.associates));
  };

  const searchBusinessUnits = ({ name, key, contactEmail }: BusinessUnit) => {
    return [name, key, contactEmail].some((e) => e && e.includes(search.businessUnits));
  };

  return {
    searchedAddresses: addresses.filter((address) => searchAddresses(address, search.addresses)),
    searchedAccountAddresses: accountAddresses.filter((address) => searchAddresses(address, search.accountAddresses)),
    searchedAssociates: associates.filter(searchAssociates),
    searchedBusinessUnits: businessUnits.filter(searchBusinessUnits),
    handleSearch,
  };
};

export default useSearch;

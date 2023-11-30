import { useCallback, useState } from 'react';
import { Address } from '@shared/types/account/Address';
import { Props } from './types';

const useSearch = ({ accountAddresses }: Props) => {
  const [search, setSearch] = useState({ accountAddresses: '' });

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

  return {
    searchedAccountAddresses: accountAddresses.filter((address) => searchAddresses(address, search.accountAddresses)),
    handleSearch,
  };
};

export default useSearch;

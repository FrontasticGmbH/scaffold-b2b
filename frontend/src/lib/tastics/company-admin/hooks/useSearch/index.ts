import { useCallback, useState } from 'react';
import { Address } from '@/types/entity/address';
import { Associate } from '@/types/entity/associate';
import { BusinessUnit } from '@/types/entity/business-unit';
import { Props } from './types';

const useSearch = ({ addresses, associates, businessUnits }: Props) => {
  const [search, setSearch] = useState({ addresses: '', accountAddresses: '', associates: '', businessUnits: '' });

  const handleSearch = useCallback(
    (key: keyof typeof search) => {
      return (val: string) => setSearch({ ...search, [key]: val });
    },
    [search],
  );

  const searchAddresses = ({ name, line1, line2, city, country, state }: Address, searchValue: string) => {
    return [name, line1, line2, city, country, state].some((e) => e && e.includes(searchValue));
  };

  const searchAssociates = ({ firstName, lastName, email }: Associate) => {
    return [firstName, lastName, email].some((e) => e && e.includes(search.associates));
  };

  const searchBusinessUnits = ({ name, key, email }: BusinessUnit) => {
    return [name, key, email].some((e) => e && e.includes(search.businessUnits));
  };

  return {
    searchedAddresses: addresses.filter((address) => searchAddresses(address, search.addresses)),
    searchedAssociates: associates.filter(searchAssociates),
    searchedBusinessUnits: businessUnits.filter(searchBusinessUnits),
    handleSearch,
  };
};

export default useSearch;

import React, { useCallback, useState } from 'react';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import { Props } from './types';
import EntitiesNotFound from '../entities-not-found';

const SearchPanel = ({
  children,
  translations,
  buttonLink,
  onSearchChange,
  buttonDisabled,
  isEmpty,
  entity,
}: React.PropsWithChildren<Props>) => {
  const { translate } = useTranslation();

  const [search, setSearch] = useState('');

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      onSearchChange?.(val);
    },
    [onSearchChange],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-stretch gap-6 md:flex-row-reverse md:items-center md:justify-between">
        <Link href={!buttonDisabled ? buttonLink : '#'} className="block w-full md:w-fit" underlineOnHover={false}>
          <Button size="m" className="w-full px-6" disabled={buttonDisabled}>
            {translations.button}
          </Button>
        </Link>
        <SearchInput
          variant="xs"
          placeholder={`${translate('common.search')}...`}
          containerClassName="w-full md:max-w-[360px]"
          handleOnChange={handleSearch}
        />
      </div>
      <div>
        {children}
        {isEmpty && <EntitiesNotFound search={!!search} entity={entity} />}
      </div>
    </div>
  );
};

export default SearchPanel;

import React, { useCallback, useState } from 'react';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import LoadingIcon from '@/components/atoms/loading-icon';
import { Props } from './types';
import EntitiesNotFound from '../entities-not-found';

const SearchPanel = ({
  children,
  translations,
  buttonLink,
  onSearchChange,
  buttonDisabled,
  isEmpty,
  isLoading,
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
        {isEmpty &&
          (isLoading ? (
            <div className="flex w-full justify-center border-x border-b border-neutral-400 py-8">
              <LoadingIcon svgWidth={20} svgHeight={20} className="fill-gray-700" />
            </div>
          ) : (
            <EntitiesNotFound search={!!search} entity={entity} />
          ))}
      </div>
    </div>
  );
};

export default SearchPanel;

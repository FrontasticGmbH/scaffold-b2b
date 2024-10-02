import React, { useCallback, useEffect, useState } from 'react';
import Overlay from '@/components/atoms/overlay';
import SearchInput from '@/components/atoms/search-input';
import useMediaQuery from '@/hooks/useMediaQuery';
import { tablet } from '@/constants/screensizes';
import useScrollBlock from '@/hooks/useScrollBlock';
import useClassNames from './hooks/useClassNames';
import { SearchProps } from './types';
import SearchPanel from './search-suggestions-panel';

const Search = ({
  disabled,
  searchValue,
  suggestions,
  variant = 'sm',
  placeholder,
  onProductClick,
  handleOnChange,
  scrollControl,
  handleSearchAction,
}: SearchProps) => {
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => {
    setTimeout(() => setFocused(false), 200);
  }, []);

  const { SearchWrapperClassNames, searchPanelClassNames } = useClassNames(variant, focused);

  const [isLargerThanTablet, width] = useMediaQuery(tablet);

  const handleOnBackClick = () => {
    setFocused(false);
  };

  const { blockScroll } = useScrollBlock();
  useEffect(() => {
    if (scrollControl) blockScroll(focused);
  }, [blockScroll, focused, scrollControl]);

  return (
    <>
      {width >= tablet && focused && variant === 'lg' && <Overlay />}
      <div className={SearchWrapperClassNames}>
        <SearchInput
          mobile={!isLargerThanTablet && focused}
          disabled={disabled}
          searchValue={searchValue}
          onFocus={onFocus}
          onBlur={onBlur}
          variant={variant}
          placeholder={placeholder}
          handleOnChange={handleOnChange}
          onBackClick={handleOnBackClick}
          handleSearchAction={handleSearchAction}
        />
        {focused && suggestions && suggestions.length > 0 && (
          <SearchPanel
            variant={variant}
            panelItems={suggestions}
            onClick={onProductClick}
            className={searchPanelClassNames}
          />
        )}
      </div>
    </>
  );
};
export default Search;

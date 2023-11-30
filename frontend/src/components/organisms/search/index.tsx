import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  searchResult,
  suggestions,
  variant = 'sm',
  placeholder,
  filterSearch,
  onClick,
  handleOnChange,
  scrollControl,
}: SearchProps) => {
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => {
    setTimeout(() => setFocused(false), 200);
  }, []);

  const { SearchWrapperClassNames, searchPanelClassNames } = useClassNames(variant, focused);

  const showPanel = useMemo(() => (searchValue ? searchResult : suggestions), [searchResult, searchValue, suggestions]);

  const [isLargerThanTablet, width] = useMediaQuery(tablet);

  const handleOnBackClick = () => {
    setFocused(false);
  };

  const { blockScroll } = useScrollBlock();
  useEffect(() => {
    scrollControl && blockScroll(focused);
  }, [blockScroll, focused, scrollControl]);

  return (
    <>
      {width >= tablet && focused && !filterSearch && variant === 'lg' && <Overlay />}
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
        />
        {focused && showPanel && !filterSearch && (
          <SearchPanel panelItems={showPanel} onClick={onClick} className={searchPanelClassNames} />
        )}
      </div>
    </>
  );
};
export default Search;

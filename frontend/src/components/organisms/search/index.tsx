import React, { useCallback, useEffect, useState } from 'react';
import Overlay from '@/components/atoms/overlay';
import SearchInput from '@/components/atoms/search-input';
import useMediaQuery from '@/hooks/useMediaQuery';
import { tablet } from '@/constants/screensizes';
import useScrollBlock from '@/hooks/useScrollBlock';
import { useFocusOutside } from '@/hooks/useFocusOutside';
import useClassNames from './hooks/useClassNames';
import { SearchProps } from './types';
import SearchPanel from './search-suggestions-panel';

const Search = (
  {
    disabled,
    searchValue,
    suggestions,
    variant = 'sm',
    placeholder,
    onProductClick,
    handleOnChange,
    scrollControl,
    handleSearchAction,
  }: SearchProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => {
    setTimeout(() => setFocused(false), 200);
  }, []);

  const { ref: containerRef } = useFocusOutside(onBlur);

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
      {width >= tablet && focused && variant === 'lg' && <Overlay onClick={onBlur} />}
      <div className={SearchWrapperClassNames} ref={containerRef}>
        <SearchInput
          ref={ref}
          mobile={!isLargerThanTablet && focused}
          disabled={disabled}
          searchValue={searchValue}
          onFocus={onFocus}
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
export default React.forwardRef(Search);

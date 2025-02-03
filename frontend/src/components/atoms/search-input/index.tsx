import React, { KeyboardEventHandler, useCallback, useState } from 'react';
import {
  ArrowLeftIcon as BackIcon,
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon as CloseIcon,
} from '@heroicons/react/24/solid';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useClassNames from './hooks/useClassNames';
import { SearchInputProps } from './types';
import Label from '../label';

const SearchInput = (
  {
    label,
    className = '',
    containerClassName = '',
    variant = 'xs',
    disabled = false,
    placeholder,
    searchValue,
    mobile,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onBackClick,
    handleOnChange,
    handleSearchAction,
  }: SearchInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const { translate } = useTranslation();
  const [value, setValue] = useControllableState(searchValue, '');

  const [searchFocused, setSearchFocused] = useState(false);

  const onFocus = useCallback(() => {
    setSearchFocused(true);
    onFocusProp?.();
  }, [onFocusProp]);
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setSearchFocused(false);
      onBlurProp?.();
    }, 200);
  }, [onBlurProp]);

  const { searchBarClassNames, searchInputClassNames, searchButtonClassNames, searchIconClassNames } = useClassNames(
    variant,
    searchFocused,
    disabled,
  );

  const handleClear = useCallback(() => {
    handleOnChange?.('');
    setValue('');
  }, [handleOnChange, setValue]);

  const onEnterKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') handleSearchAction?.();
  };

  const handleClick = () => {
    if (variant === 'lg') handleSearchAction?.();
  };

  return (
    <>
      {label && variant !== 'lg' && <Label required={false}>{label}</Label>}
      <div className={classnames(searchBarClassNames, containerClassName)}>
        {variant === 'lg' && mobile && (
          <button
            aria-label={translate('common.search')}
            data-testid="back-button"
            onClick={onBackClick}
            className="flex items-center justify-center bg-white px-3 transition"
          >
            <BackIcon className="w-5 fill-gray-600 stroke-0" />
          </button>
        )}
        <input
          ref={ref}
          aria-label={translate('product.search.results.for')}
          disabled={disabled}
          value={value}
          className={classnames(searchInputClassNames, className)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          onChange={(e) => {
            handleOnChange?.(e.target.value);
            setValue(e.target.value);
          }}
          onKeyDown={onEnterKeyDown}
        />

        {variant === 'lg' && value && (
          <button
            aria-label={translate('common.close')}
            onClick={handleClear}
            className="shrink-0 bg-white px-4 transition"
            data-testid="clear-button"
          >
            <CloseIcon className="w-5 fill-gray-600 stroke-0" />
          </button>
        )}
        {variant !== 'lg' && value ? (
          <button aria-label={translate('common.clear')} onClick={handleClear} className={searchButtonClassNames}>
            <CloseIcon className={searchIconClassNames} />
          </button>
        ) : (
          <button
            aria-label={translate('common.search')}
            disabled={disabled}
            type="submit"
            className={searchButtonClassNames}
            onClick={handleClick}
          >
            <SearchIcon className={searchIconClassNames} />
          </button>
        )}
      </div>
    </>
  );
};

export default React.forwardRef(SearchInput);

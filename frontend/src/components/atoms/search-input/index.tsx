import React, { useCallback, useState } from 'react';
import {
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon as CloseIcon,
  ArrowLeftIcon as BackIcon,
} from '@heroicons/react/24/solid';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import useClassNames from './hooks/useClassNames';
import { SearchInputProps } from './types';
import Label from '../label';

const SearchInput = ({
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
}: SearchInputProps) => {
  const [value, setValue] = useControllableState(searchValue);

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

  return (
    <>
      {label && variant !== 'lg' && <Label required={false}>{label}</Label>}
      <div className={classnames(searchBarClassNames, containerClassName)}>
        {variant === 'lg' && mobile && (
          <button onClick={onBackClick} className="flex items-center justify-center bg-white px-3 transition">
            <BackIcon className="w-5 fill-gray-600 stroke-0" />
          </button>
        )}
        <input
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
        />
        {variant === 'lg' && value && (
          <button onClick={handleClear} className="shrink-0 bg-white px-4 transition">
            <CloseIcon className="w-5 fill-gray-600 stroke-0" />
          </button>
        )}
        {(variant === 'sm' || variant === 'xs') && value ? (
          <button onClick={handleClear} className={searchButtonClassNames}>
            <CloseIcon className={searchIconClassNames} />
          </button>
        ) : (
          <button disabled={disabled} type="submit" className={searchButtonClassNames}>
            <SearchIcon className={searchIconClassNames} />
          </button>
        )}
      </div>
    </>
  );
};

export default SearchInput;

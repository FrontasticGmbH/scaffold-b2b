import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { SearchVariant } from '../../types';

const useClassNames = (variant: SearchVariant, focused: boolean, disabled: boolean) => {
  const resolveSearchBar = cva({
    xs: classnames(
      'rounded-md',
      focused ? 'border-neutral-800 shadow-200' : 'border-gray-300',
      disabled ? 'bg-neutral-200' : 'border bg-white',
    ),
    sm: classnames(
      'rounded-md',
      focused ? 'border-neutral-800 shadow-200' : 'border-gray-300',
      disabled ? 'bg-neutral-200' : 'border bg-white',
    ),
    lg: 'rounded-sm border border-neutral-400',
  });

  const resolveSearchInput = cva({
    xs: classnames(
      'placeholder:text-14 placeholder:text-gray-600 disabled:cursor-not-allowed disabled:placeholder:text-gray-300',
    ),
    sm: classnames(
      'placeholder:text-14 placeholder:text-gray-600 disabled:cursor-not-allowed disabled:placeholder:text-gray-300',
    ),
    lg: 'placeholder:text-16 placeholder:text-gray-700',
  });

  const resolveSearchButton = cva({
    xs: classnames('rounded-r-md bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-neutral-200'),
    sm: classnames('rounded-r-md bg-white p-3 disabled:cursor-not-allowed disabled:bg-neutral-200'),
    lg: classnames(focused ? 'bg-primary' : 'bg-white', 'h-10 rounded-r-sm border-l border-neutral-400 px-4'),
  });

  const resolveSearchIcon = cva({
    xs: classnames('w-5', disabled ? 'text-gray-300' : 'text-gray-600'),
    sm: classnames('w-5', disabled ? 'text-gray-300' : 'text-gray-600'),
    lg: classnames('w-6', focused ? 'text-white' : 'text-gray-600'),
  });

  const searchBarClassNames = classnames('relative flex', resolveSearchBar(variant) as string);

  const searchInputClassNames = classnames(
    'box-content w-full rounded-sm border-none pl-3 transition focus:outline-none disabled:bg-neutral-200',
    resolveSearchInput(variant) as string,
  );
  const searchButtonContainerClassNames = classnames('absolute right-0 z-[5] flex shrink-0');
  const searchButtonClassNames = classnames('transition', resolveSearchButton(variant) as string);

  const searchIconClassNames = classnames(resolveSearchIcon(variant) as string);

  return {
    searchBarClassNames,
    searchInputClassNames,
    searchButtonClassNames,
    searchIconClassNames,
    searchButtonContainerClassNames,
  };
};

export default useClassNames;

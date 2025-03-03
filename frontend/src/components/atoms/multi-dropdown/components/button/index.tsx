import React from 'react';
import { ListboxButton } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useClassNames from '../../hooks/useClassNames';
import { useDropdown } from '../../context';
import { Props } from './types';

const DropdownButton = ({ children, className }: Props) => {
  const { translate } = useTranslation();
  const { disabled, size, value, defaultValue, onToggle, isExpanded } = useDropdown();

  const { buttonClassName } = useClassNames({ disabled, size });

  return (
    <ListboxButton
      data-testid="multi-dropdown-button"
      aria-label={translate('common.select')}
      className={classnames(className, buttonClassName)}
      onClick={onToggle}
    >
      <div className="block truncate">
        {typeof children === 'function'
          ? children({
              selected: (!value || value.length === 0 ? defaultValue : value)?.map((value) => ({ value })) ?? [],
              isExpanded,
            })
          : children}
      </div>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ArrowIcon className="h-[18px]" aria-hidden="true" />
      </span>
    </ListboxButton>
  );
};

export default DropdownButton;

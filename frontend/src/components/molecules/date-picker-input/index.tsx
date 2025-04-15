import React from 'react';
import useDisclosure from '@/hooks/useDisclosure';
import { DayPickerProps } from 'react-day-picker';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { useFocusOutside } from '@/hooks/useFocusOutside';
import DatePicker from '../date-picker';

const DatePickerInput = (props: DayPickerProps) => {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const { ref } = useFocusOutside(onClose);

  return (
    <div className="relative" ref={ref}>
      <button
        className="h-[42px] w-full min-w-[200px] rounded-md border border-gray-300 pl-3 pr-10 text-left text-14 focus:border-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200"
        onClick={onToggle}
      >
        {props.mode === 'range' &&
          (props?.selected?.from && props?.selected?.to
            ? `${props.selected.from ? new Date(props.selected.from).toLocaleDateString() : ''} : ${
                props.selected.to ? new Date(props.selected.to).toLocaleDateString() : ''
              }`
            : 'dd/mm/yy')}

        {props.mode === 'single' && (props.selected?.toLocaleDateString() ?? 'dd/mm/yy')}

        {props.mode === 'multiple' &&
          (props.selected?.map((date) => date?.toLocaleDateString()).join(', ') ?? 'dd/mm/yy')}
        <span
          aria-label="Dropdown button"
          data-testid="dropdown-button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <ChevronDownIcon className="h-[18px]" aria-hidden="true" />
        </span>
      </button>
      <Transition show={isOpen} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="absolute z-10 min-w-[300px] bg-white p-1 shadow-md">
          <DatePicker {...props} />
        </div>
      </Transition>
    </div>
  );
};

export default DatePickerInput;

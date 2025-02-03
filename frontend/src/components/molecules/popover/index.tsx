import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import Overlay from '@/components/atoms/overlay';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const PopoverButton = ({ isOpen, direction, onClose, buttonElement, children }: React.PropsWithChildren<Props>) => {
  const popoverPanelClassNames = classnames(direction === 'left' ? 'left-0' : 'right-0', 'absolute top-10 z-[999]');

  return (
    <>
      <Popover className="relative">
        <Popover.Button as={Fragment}>{buttonElement}</Popover.Button>

        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className={classnames(popoverPanelClassNames, 'rounded-b-sm bg-white')}>
            {children}
          </Popover.Panel>
        </Transition>
      </Popover>
      {isOpen && <Overlay zIndex="z-[350]" onClick={onClose} />}
    </>
  );
};

export default PopoverButton;

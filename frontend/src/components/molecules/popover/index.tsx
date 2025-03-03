import React, { Fragment } from 'react';
import { Popover as HeadlessPopover, PopoverButton, Transition, PopoverPanel } from '@headlessui/react';
import Overlay from '@/components/atoms/overlay';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const Popover = ({ isOpen, direction, onClose, buttonElement, children }: React.PropsWithChildren<Props>) => {
  const popoverPanelClassNames = classnames(direction === 'left' ? 'left-0' : 'right-0', 'absolute top-10 z-[999]');

  return (
    <>
      <HeadlessPopover className="relative">
        <PopoverButton as={Fragment}>{buttonElement}</PopoverButton>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel className={classnames(popoverPanelClassNames, 'rounded-b-sm bg-white')}>
            {children}
          </PopoverPanel>
        </Transition>
      </HeadlessPopover>
      {isOpen && <Overlay zIndex="z-[350]" onClick={onClose} />}
    </>
  );
};

export default Popover;

'use client';
import React, { useEffect } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { Transition } from '@headlessui/react';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useScrollBlock from '@/hooks/useScrollBlock';
import Typography from '@/components/atoms/typography';
import Button from '@/components/atoms/button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DrawerProps } from './types';
import useClassNames from './hooks/useClassNames';
import Overlay from '../../atoms/overlay';

const Drawer = ({
  className = '',
  headerClassName,
  isOpen,
  overlay = true,
  headline,
  direction = 'right',
  blockScrolling = true,
  onClose,
  children,
}: React.PropsWithChildren<DrawerProps>) => {
  const { blockScroll } = useScrollBlock();

  useEffect(() => {
    if (blockScrolling) {
      blockScroll(isOpen);
    }
  }, [isOpen, blockScroll, blockScrolling]);

  const { ref } = useOnClickOutside(() => onClose?.());

  const { drawerClassName: drawerWrapperClassName, drawerTransition } = useClassNames(direction);

  const drawerHeaderClassName = classnames(headerClassName, 'p-4 lg:p-5');

  const drawerClassName = classnames(className, 'flex h-full w-[280px] flex-col bg-white lg:w-[380px]');

  return (
    <>
      {isOpen && overlay && <Overlay zIndex="z-[345]" onClick={onClose} />}

      <Transition
        as="div"
        show={isOpen}
        enter="ease-out transition duration-100"
        enterFrom={drawerTransition.enterFrom}
        enterTo={drawerTransition.enterTo}
        leave="ease-in duration-75"
        leaveFrom={drawerTransition.leaveFrom}
        leaveTo={drawerTransition.leaveTo}
        className={drawerWrapperClassName}
      >
        <div ref={ref} className={drawerClassName}>
          <div className={drawerHeaderClassName}>
            <div className="flex items-center justify-between">
              <Typography
                as="h2"
                fontSize={18}
                fontWeight="extrabold"
                className="text-gray-700 lg:text-24 lg:font-bold"
              >
                {headline}
              </Typography>
              <Button variant="ghost" size="l" Icon={XMarkIcon} onClick={onClose} />
            </div>
          </div>
          <div className="grow overflow-y-auto">{children}</div>
        </div>
      </Transition>
    </>
  );
};

export default Drawer;

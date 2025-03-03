import React from 'react';
import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon as TruncateIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';

const Truncator = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative">
      <Menu>
        <MenuButton className="inline-flex w-full justify-center rounded-md bg-white p-1 transition hover:bg-black/5 focus:outline-none">
          <TruncateIcon data-testid="truncate-icon" className="text-gray-700" width={16} />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute bottom-0 left-1/2 mt-2 w-56 -translate-x-1/2 translate-y-full divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none">
            {React.Children.map(children, (Child) => (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={classnames('block w-full p-2 text-14 font-normal text-gray-700 transition', {
                      'bg-gray-100': focus,
                    })}
                  >
                    {Child}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default Truncator;

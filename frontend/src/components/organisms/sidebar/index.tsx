import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import Link from '@/components/atoms/link';
import { SidebarProps } from './types';

const Sidebar = ({ title, links = [] }: SidebarProps) => {
  return (
    <div className="h-full w-fit bg-[#F7F7F7] px-7 py-10">
      <h6 className="px-5 text-12 font-medium text-gray-500">{title}</h6>
      <div className="mt-4 flex flex-col items-start gap-4">
        {links.map(({ name, href, openInNewTab, isActive }) => (
          <Link
            key={href}
            className={classnames(
              'w-full rounded-lg px-5 py-2 text-14 font-medium text-gray-600 hover:bg-neutral-300',
              {
                'bg-neutral-300': isActive,
              },
            )}
            href={href ?? '#'}
            openInNewTab={openInNewTab}
            underlineOnHover={false}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

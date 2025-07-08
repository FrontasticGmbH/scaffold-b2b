import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { useTabs } from '../../context';

const TabList = ({ children }: React.PropsWithChildren) => {
  const { activeTabIndex, setActiveTabIndex, onActiveIndexChange } = useTabs();

  return (
    <div className="flex items-center gap-5 overflow-visible border-b-2 border-neutral-400 lg:gap-10">
      {React.Children.map(children, (Child, index) => {
        const tabClassName = classnames(
          'mb-[-2px] cursor-pointer whitespace-pre border-b-2 py-2 leading-[16px] transition hover:border-gray-800',
          {
            'border-transparent': index !== activeTabIndex,
            'border-gray-800 font-bold': index === activeTabIndex,
          },
        );

        return (
          <button
            className={tabClassName}
            onClick={() => {
              setActiveTabIndex(index);
              onActiveIndexChange?.(index);
            }}
          >
            {Child}
          </button>
        );
      })}
    </div>
  );
};

export default TabList;

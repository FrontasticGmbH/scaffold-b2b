import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { useTabs } from '../../context';
import { Props } from './types';

const Panels = ({ children, className }: React.PropsWithChildren<Props>) => {
  const { activeTabIndex } = useTabs();

  return (
    <div className={classnames('overflow-auto pt-4 lg:pt-6', className)}>
      {React.Children.toArray(children)[Math.min(React.Children.count(children) - 1, Math.max(0, activeTabIndex))]}
    </div>
  );
};

export default Panels;

import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { InfoBannerProps } from './types';
import useClassNames from './hooks/useClassNames';

const InfoBanner = ({ children, className, variant = 'primary' }: React.PropsWithChildren<InfoBannerProps>) => {
  const { bannerClassName, sidebarClassName } = useClassNames({ variant });

  return (
    <div className={classnames(bannerClassName, className)}>
      <span className={sidebarClassName} />
      <div className="py-3 pr-3 text-14 text-gray-700 md:pr-4 lg:pr-5">{children}</div>
    </div>
  );
};

export default InfoBanner;

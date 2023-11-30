'use client';

import { PropsWithChildren } from 'react';
import Image from '@/components/atoms/Image';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
import { AuthLayoutProps } from '../types';
import HeaderLogo from '../../header/logo';

const AuthLayout = ({ image, logo, logoLink, children }: PropsWithChildren<AuthLayoutProps>) => {
  const [isDesktopSize] = useMediaQuery(desktop);

  return (
    <div className="grid h-[100vh] lg:grid-cols-2">
      <div className="relative md:col-span-1">
        <div className="grid w-full content-center border-b border-neutral-400 px-4 py-5 md:px-6 lg:absolute lg:px-12 lg:py-7">
          <div className="w-[180px] lg:w-[205px]">
            <HeaderLogo logo={logo} logoLink={logoLink} />
          </div>
        </div>

        <div className="flex h-full w-full flex-col gap-6 px-4 pt-9 md:mx-auto md:w-[372px] md:px-0 md:pt-16 lg:grid lg:w-[452px] lg:content-center lg:gap-0 lg:p-0">
          {children}
        </div>
      </div>
      {isDesktopSize && <Image className="h-full w-full object-cover" {...image} />}
    </div>
  );
};

export default AuthLayout;

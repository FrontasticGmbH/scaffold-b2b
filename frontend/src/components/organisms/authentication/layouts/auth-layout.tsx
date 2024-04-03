'use client';

import { PropsWithChildren } from 'react';
import Image from '@/components/atoms/Image';
import { AuthLayoutProps } from '../types';
import HeaderLogo from '../../header/logo';

const AuthLayout = ({ image, logo, logoLink, children }: PropsWithChildren<AuthLayoutProps>) => {
  return (
    <div className="grid min-h-[100vh] lg:grid-cols-2">
      <div className="relative md:col-span-1">
        <div className="grid w-full content-center border-b border-neutral-400 px-4 py-5 md:px-6 lg:absolute lg:border-none lg:px-12 lg:py-7">
          <div className="w-[170px] lg:w-[215px]">
            <HeaderLogo logo={logo} logoLink={logoLink} />
          </div>
        </div>

        <div className="flex h-full w-full flex-col gap-6 px-4 pt-9 md:mx-auto md:w-[372px] md:px-0 md:pt-16 lg:grid lg:w-[452px] lg:content-center lg:gap-0 lg:px-0 lg:py-20">
          {children}
        </div>
      </div>
      <Image className="hidden h-full w-full object-cover lg:block" {...image} />
    </div>
  );
};

export default AuthLayout;

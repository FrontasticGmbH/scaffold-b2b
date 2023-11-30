'use client';

import React from 'react';
import NextLink from 'next/link';
import { classnames } from '@/utils/classnames/classnames';
import { ChevronRightIcon as ChevronIcon } from '@heroicons/react/24/solid';
import { LinkProps } from './types';

const Link = ({
  children,
  openInNewTab = false,
  className = '',
  chevron = false,
  underlineOnHover = true,
  ...props
}: LinkProps) => {
  const linkClassName = classnames(className, 'w-fit', {
    'underline-offset-4 hover:underline': underlineOnHover,
    'flex items-center gap-1': !!chevron,
  });

  return (
    <NextLink target={openInNewTab ? '_blank' : '_self'} className={linkClassName} {...props}>
      {children}
      {chevron && <ChevronIcon width={16} />}
    </NextLink>
  );
};

export default Link;

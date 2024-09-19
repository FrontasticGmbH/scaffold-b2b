'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { classnames } from '@/utils/classnames/classnames';
import { ChevronRightIcon as ChevronIcon } from '@heroicons/react/24/solid';
import { constructLocalizedUrl } from '@/utils/links';
import { Locale } from '@/project.config';
import { LinkProps } from './types';

const Link = ({
  children,
  href,
  locale: localeOverride,
  openInNewTab = false,
  className = '',
  chevron = false,
  underlineOnHover = true,
  ...props
}: LinkProps) => {
  const { locale } = useParams<{ locale: Locale }>();

  const linkClassName = classnames(className, 'w-fit', {
    'underline-offset-4 hover:underline': underlineOnHover,
    'flex items-center gap-1': !!chevron,
  });

  return (
    <NextLink
      href={constructLocalizedUrl(href.toString(), localeOverride ?? locale)}
      target={openInNewTab ? '_blank' : '_self'}
      className={linkClassName}
      {...props}
    >
      {children}
      {chevron && <ChevronIcon width={16} />}
    </NextLink>
  );
};

export default Link;

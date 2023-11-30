'use client';

import React from 'react';
import Link from '@/components/atoms/link';
import { FooterProps } from './types';
import useClassNames from './hooks/useClassNames';

const Footer = ({ links = [], copyrightStatement = '', variant = 'default' }: FooterProps) => {
  const { className } = useClassNames(variant);

  return (
    <footer className={className}>
      {variant !== 'simple' && (
        <div className="mx-auto flex w-fit flex-col items-center gap-4 py-6 text-14 text-white md:flex-row md:gap-10 md:text-16">
          {links.map(({ name, href, openInNewTab }, index) => (
            <Link key={index} href={href ?? '#'} openInNewTab={openInNewTab}>
              {name}
            </Link>
          ))}
        </div>
      )}
      <div className="cursor-default text-center text-12 text-white md:text-14">{copyrightStatement}</div>
    </footer>
  );
};

export default Footer;

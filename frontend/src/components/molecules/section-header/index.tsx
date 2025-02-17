'use client';

import React from 'react';
import Link from '@/components/atoms/link';
import { SectionHeaderProps } from './types';

const SectionHeader = ({ title, link }: SectionHeaderProps) => {
  return (
    <div className="pb-7 pt-8 text-center lg:pb-9 lg:pt-12">
      {title && (
        <span data-testid="title-text" className="text-16 font-bold text-gray-800 md:text-18 lg:text-24">
          {title}
        </span>
      )}
      {link?.href && (
        <Link
          href={link.href ?? '#'}
          openInNewTab={link.openInNewTab}
          className="mx-auto mt-4 p-1 text-14 font-medium text-primary lg:text-16"
          chevron
        >
          {link.name}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;

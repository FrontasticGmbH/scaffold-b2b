'use client';

import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { TagProps } from './types';
import useClassNames from './hooks/useClassNames';

const Tag = ({ children, variant = 'primary', className = '' }: React.PropsWithChildren<TagProps>) => {
  const { className: tagClassName } = useClassNames(variant);

  return <div className={classnames(tagClassName, className)}>{children}</div>;
};

export default Tag;

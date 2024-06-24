import React, { PropsWithChildren } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { EmptyStateProps } from './types';

const EmptyState = ({ children, header, image, className = '' }: PropsWithChildren<EmptyStateProps>) => {
  return (
    <div className={classnames('mx-auto flex max-w-lg flex-col px-6 py-12 text-center', className)}>
      {image && <div className="mb-6 h-32 w-32">{image}</div>}
      <h3 className="mb-6 text-2xl">{header}</h3>
      <div>{children}</div>
    </div>
  );
};

export default EmptyState;

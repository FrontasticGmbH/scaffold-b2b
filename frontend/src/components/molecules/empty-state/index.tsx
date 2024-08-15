import React, { PropsWithChildren } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import LoadingIcon from '@/components/atoms/loading-icon';
import { EmptyStateProps } from './types';

const EmptyState = ({ children, header, image, className = '', isLoading }: PropsWithChildren<EmptyStateProps>) => {
  return (
    <div className={classnames('mx-auto flex max-w-lg flex-col px-6 py-12 text-center', className)}>
      {isLoading ? (
        <div className="flex w-full justify-center">
          <LoadingIcon svgWidth={20} svgHeight={20} className="fill-gray-700" />
        </div>
      ) : (
        <>
          {image && <div className="mb-6 h-32 w-32">{image}</div>}
          {header && <h3 className="mb-6 text-2xl">{header}</h3>}
        </>
      )}
      <div>{children}</div>
    </div>
  );
};

export default EmptyState;

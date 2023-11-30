'use client';

import { FC } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import ReactSkeleton from 'react-loading-skeleton';
import { SkeletonProps } from './types';
import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton: FC<SkeletonProps> = ({ className, fillMode = false, ...props }) => {
  const classNames = classnames({ 'absolute left-0 top-0 z-10 h-full w-full': fillMode }, className);

  return (
    <span className={classNames}>
      <ReactSkeleton className="h-full w-full" {...props} />
    </span>
  );
};

export default Skeleton;

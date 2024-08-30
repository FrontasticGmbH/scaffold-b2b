'use client';

import { classnames } from '@/utils/classnames/classnames';
import ReactSkeleton from 'react-loading-skeleton';
import { SkeletonProps } from './types';
import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton = ({ className, fillMode = false, ...props }: SkeletonProps) => {
  const classNames = classnames({ 'absolute left-0 top-0 z-10 h-full w-full': fillMode }, className);

  return (
    <span data-testid="skeleton" className={classNames} {...props}>
      <ReactSkeleton className="h-full w-full" />
    </span>
  );
};

export default Skeleton;

import { SkeletonProps as ReactSkeletonProps } from 'react-loading-skeleton';

export type SkeletonProps = ReactSkeletonProps & {
  className?: string;
  fillMode?: boolean;
};

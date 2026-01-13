import React from 'react';
import { classnames } from '@/utils/classnames/classnames';

type Props = {
  name: string;
  className?: string;
};

const FlagIconSquare: React.FC<Props> = ({ className, name }: Props) => {
  return (
    <span className={classnames(className, 'fi', `fi-${name}`, 'fib', 'block')} style={{ width: 30, height: 25 }} />
  );
};

export default FlagIconSquare;

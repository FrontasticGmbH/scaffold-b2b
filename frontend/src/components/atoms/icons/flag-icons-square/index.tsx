import React from 'react';
import { classnames } from '@/utils/classnames/classnames';

type Props = {
  name: string;
  className?: string;
};

const FlagIconSquare: React.FC<Props> = ({ className, name }: Props) => {
  return (
    <span
      //eslint-disable-next-line tailwindcss/no-custom-classname
      className={classnames(className, 'fi', `fi-${name}`, 'fis', 'block')}
      style={{ width: 30, height: 20, backgroundSize: 'cover' }}
    />
  );
};

export default FlagIconSquare;
